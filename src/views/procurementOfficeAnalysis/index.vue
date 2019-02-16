<template>
  <div class="office-analysis-container">
    <div class="select-tools">
      <div>
        <div class="month-range">
          <el-date-picker
            ref="startMonth"
            :editable="false"
            :clearable="false"
            v-model="select.startDate"
            :picker-options="pickerOptionsStart"
            name="startMonth"
            type="month"
            placeholder="选择预算开始时间"
            value-format="yyyy-MM"
            @blur="monthRangeBlur"
          />
          <span class="month-range-separator">至</span>
          <el-date-picker
            ref="endMonth"
            :editable="false"
            :clearable="false"
            v-model="select.endDate"
            :picker-options="pickerOptionsEnd"
            name="endMonth"
            type="month"
            placeholder="选择预算结束时间"
            value-format="yyyy-MM"
            @blur="monthRangeBlur"
          />
        </div>
        <div>
          <el-cascader
            :options="constant.office"
            :props="departmentType"
            v-model="select.selectDepart"
            change-on-select
            placeholder="部门"
            clearable/>
        </div>
      </div>
      <div class="btn">
        <div>
          <el-button type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
        </div>
        <div>
          <el-button icon="el-icon-refresh" @click="resetSearch">重置搜索条件</el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
        </div>
      </div>
    </div>
    <div>
      <h3>{{ officeName }}</h3>
    </div>
    <el-table v-loading="loading" :data="dataList[0].statisticItem" element-loading-text="Loading" highlight-current-row fit>
      <el-table-column prop="name" width="120">
        <template slot-scope="scope">
          <div v-if="scope.$index === 0" class="table-title">项目名称</div>
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column v-for="(item ,index) in dataList" :key="index" :label="item.year" :min-width="400">
        <template slot-scope="scope">
          <div :class="{columnBack: index % 2 == 0}">
            <div v-if="scope.$index === 0" class="data-style table-title">
              <span v-for="o in tanleTitle" :key="o.key">{{ o.key }}</span>
            </div>
            <div class="data-style">
              <span>
                <count-num :num="Number(dataList[index].statisticItem[scope.$index].singlePrice)" :size="14" prefix="￥"/>
              </span>
              <span>
                <count-num :num="Number(dataList[index].statisticItem[scope.$index].number)" :size="14" prefix="￥"/>
              </span>
              <span>
                <count-num :num="Number(dataList[index].statisticItem[scope.$index].applyAmount)" :size="14" prefix="￥"/>
              </span>
              <span class="table-category">
                {{ dataList[index].statisticItem[scope.$index].type }}
              </span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { parseTime, exportExcel } from '@/utils'
import { getPurchaseAnalyzeList, exportPurchaseAnalyze } from '@/api/procurementOfficeAnalysis'
import tables from '@/mixin/tables'
import CountNum from '@/components/Plugins/CountNum'
export default {
  components: {
    CountNum
  },
  mixins: [tables],
  data() {
    return {
      officeName: '',
      loading: true,
      tanleTitle: [
        { key: '单价' },
        { key: '数量' },
        { key: '预算金额' },
        { key: '费用类别' }
      ],
      dataList: [
        {
          year: '',
          statisticItem: []
        }
      ],
      select: {
        selectDepart: [],
        startDate: parseTime(new Date() - 30 * 3600 * 1000 * 24, 'y-m'),
        endDate: parseTime(new Date() - 30 * 3600 * 1000 * 24, 'y-m'),
        officeIds: ''
      },
      departmentType: {
        value: 'id',
        label: 'name'
      },
      params: {},
      pickerOptionsStart: {
        disabledDate: time => {
          const endDateVal = this.select.endDate
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          const beginDateVal = this.select.startDate
          if (beginDateVal) {
            return (
              time.getTime() <= new Date(beginDateVal).getTime()
            )
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'constant'])
  },
  created() {
    this.select.officeIds = this.userInfo.office.id
    this.$store.dispatch('GetConstant', 'office').then(() => {
      this.initSearchCriteria()
      this.fetchData()
    })
  },
  methods: {
    fetchData() {
      this.loading = true
      const { selectDepart, startDate, endDate } = this.select
      this.params = {
        startDate: startDate && new Date(startDate).getTime() || '',
        endDate: endDate && new Date(endDate).getTime() || '',
        officeIds: selectDepart && selectDepart[selectDepart.length - 1] || this.userInfo.office.id
      }
      getPurchaseAnalyzeList({ ...this.params }).then(({ data }) => {
        this.loading = false
        if (data.list.length) {
          this.dataList = data.list
        }
        this.officeName = data.office.allName
      })
    },
    exportExcel() {
      exportPurchaseAnalyze({ Loading: true, ...this.params }).then(res => {
        exportExcel(res, '采购及办公分析')
      })
    }
  }
}
</script>

<style lang="scss">
.office-analysis-container{
  .el-table .cell{
    padding: 0px !important;
    line-height: 35px;
  }
  .el-table td {
    padding: 0px;
  }
  .table-title{
    // min-height: 35px;
    // line-height: 35px;
    border-bottom: 1px solid #e6ebf5;
    // margin-bottom: 8px;
  }
  .data-style{
    display: flex;
    justify-content: center;
    & > span{
      width: 25%;
      text-align: center;
    }
  }
  .table-category{
    color: #5a5e66;
    font-size: 14px;
  }
  .columnBack{
    background: #fafafa;
  }
}
</style>

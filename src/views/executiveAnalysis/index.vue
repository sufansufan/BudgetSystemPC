<template>
  <div class="executive-container">
    <div class="select-tools">
      <div>
        <div class="month-range">
          <el-date-picker
            ref="startMonth"
            :editable="false"
            :clearable="false"
            v-model="select.budgetStartDate"
            :picker-options="pickersBudgetStart"
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
            v-model="select.budgetEndDate"
            :picker-options="pickersBudgetEnd"
            name="endMonth"
            type="month"
            placeholder="选择预算开始时间"
            value-format="yyyy-MM"
            @blur="monthRangeBlur"
          />
        </div>
        <div class="month-range">
          <el-date-picker
            ref="startMonthCompare"
            :editable="false"
            v-model="select.comparisonStartDate"
            :picker-options="pickerCompareStart"
            name="startMonthCompare"
            type="month"
            placeholder="选择对比开始月份"
            value-format="yyyy-MM"
            @blur="monthRangeBlur($event, 'Compare')"
          />
          <span class="month-range-separator">至</span>
          <el-date-picker
            ref="endMonthCompare"
            :editable="false"
            v-model="select.comparisonEndDate"
            :picker-options="pickerCompareEnd"
            name="endMonthCompare"
            type="month"
            placeholder="选择对比结束月份"
            value-format="yyyy-MM"
            @blur="monthRangeBlur($event, 'Compare')"
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
        <div>
          <ele-multi-cascader
            ref="multiCascader"
            :options="constant.project"
            :props="{value: 'id', label: 'name', children: 'budgetLevels'}"
            v-model="select.budgetLevelIds"
            style="width: 465px;"
            placeholder="请选择费用项目"
          />
        </div>
        <div>
          <div :class="{'single-month': select.whetherSingleMonth, 'month-action': true}">
            <el-button size="small" @click="monthClick">单月展示</el-button>
          </div>
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
    <el-table v-loading="loading" :data="dataTitle" stripe element-loading-text="Loading" highlight-current-row fit>
      <el-table-column prop="name" width="120">
        <template slot-scope="scope">
          <div v-if="scope.$index === 0" class="table-title title-name"><span>项目名称</span></div>
          <div><span>{{ scope.row.name }}</span></div>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in dataList" :key="index" :label="item.year" :min-width="520">
        <template slot-scope="scope">
          <div>
            <div v-if="scope.$index === 0" class="table-title data-style">
              <span v-for="o in scope.row.value" :key="o.key">{{ o.key }}</span>
              <span>差额</span>
            </div>
            <div class="data-style">
              <span v-for="(o, i) in scope.row.value" :key="o.key">
                <count-num :num="dataList[index].statisticItem[scope.$index] && dataList[index].statisticItem[scope.$index].value[i].value" :size="16" prefix="￥"/>
              </span>
              <span>
                <count-num :num="Number(dataList[index].statisticItem[scope.$index] && dataList[index].statisticItem[scope.$index].value[0].value) - Number(dataList[index].statisticItem[scope.$index] && dataList[index].statisticItem[scope.$index].value[2].value)" :size="16" prefix="￥"/>
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
import { getExecuteAnalyzeList, exportExecuteAnalyzeList } from '@/api/executiveAnalysis'
import OfficeAnalysis from '../procurementOfficeAnalysis'
import tables from '@/mixin/tables'
import CountNum from '@/components/Plugins/CountNum'
import { parseTime, exportExcel } from '@/utils'
export default {
  name: 'ExecutiveAnalysis',
  components: {
    OfficeAnalysis,
    CountNum
  },
  mixins: [tables],
  data() {
    return {
      loading: true,
      officeName: '',
      params: {},
      select: {
        budgetStartDate: parseTime(new Date() - 30 * 3600 * 1000 * 24, 'y-m'),
        budgetEndDate: parseTime(new Date() - 30 * 3600 * 1000 * 24, 'y-m'),
        comparisonStartDate: '',
        comparisonEndDate: '',
        budgetLevelIds: [1],
        officeIds: '',
        whetherSingleMonth: true,
        selectDepart: []
      },
      dataList: [
        {
          year: '',
          statisticItem: [

          ]
        }
      ],
      dataTitle: [],
      departmentType: {
        value: 'id',
        label: 'name'
      },
      pickersBudgetStart: {
        disabledDate: time => {
          const endDateVal = this.select.budgetEndDate
          if (endDateVal) {
            return (time.getTime() < new Date(endDateVal).getTime() - 3600 * 1000 * 24 * 356 || time.getTime() > new Date(endDateVal).getTime())
          }
        }
      },
      pickersBudgetEnd: {
        disabledDate: time => {
          const beginDateVal = this.select.budgetStartDate
          if (beginDateVal) {
            return (time.getTime() <= new Date(beginDateVal).getTime() || time.getTime() >= new Date(beginDateVal).getTime() + 3600 * 1000 * 24 * 356)
          }
        }
      },
      pickerCompareStart: {
        disabledDate: time => {
          const endDateVal = this.select.comparisonEndDate
          if (endDateVal) {
            return (time.getTime() > new Date(endDateVal).getTime() || time.getTime() < new Date(endDateVal).getTime() - 3600 * 1000 * 24 * 356)
          }
        }
      },
      pickerCompareEnd: {
        disabledDate: time => {
          const beginDateVal = this.select.comparisonStartDate
          if (beginDateVal) {
            return (
              time.getTime() <= new Date(beginDateVal).getTime() || time.getTime() >= new Date(beginDateVal).getTime() + 3600 * 1000 * 24 * 356
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
    this.$store.dispatch('GetConstant', ['project', 'office']).then(() => {
      this.initSearchCriteria()
      this.fetchData()
    })
  },
  methods: {
    fetchData() {
      this.loading = true
      const { budgetStartDate, budgetEndDate, comparisonStartDate, comparisonEndDate, selectDepart, budgetLevelIds } = this.select
      this.select.officeIds = selectDepart[selectDepart.length - 1 ] || this.userInfo.office.id
      const selectModify = {
        budgetStartDate: new Date(budgetStartDate).getTime(),
        budgetEndDate: new Date(budgetEndDate).getTime(),
        comparisonStartDate: comparisonStartDate && new Date(comparisonStartDate).getTime() || '',
        comparisonEndDate: comparisonEndDate && new Date(comparisonEndDate).getTime() || '',
        budgetLevelIds: budgetLevelIds.join(',') || '1'
      }
      this.params = Object.assign({}, this.select, selectModify)
      delete this.params.selectDepart
      getExecuteAnalyzeList({ ...this.params }).then(({ data }) => {
        this.loading = false
        this.dataList = data.list
        this.dataTitle = data.list[0].statisticItem
        this.officeName = data.office.allName
      })
    },
    monthClick() {
      this.select.whetherSingleMonth = !this.select.whetherSingleMonth
    },
    exportExcel() {
      exportExecuteAnalyzeList({ Loading: true, ...this.params }).then(res => {
        exportExcel(res, '执行分析')
      })
    }
  }
}
</script>

<style lang="scss">
.executive-container{
  .el-table .cell{
    padding: 0px;
    margin-top: -1px;
  }
  .el-table tr:first-child {
    & > td {
      padding-top: 0px;
    }
  }
  .month-action{
    .el-button{
      color: #5a5e66;
      &:hover, &:focus{
        background: none;
        color: none;
        border-color: #d8dce5;
      }
    }
  }
  .single-month{
    position: relative;
    .el-button{
      color: #c19b62;
      border-color: #c19b62 !important;
      &:hover, &:focus{
        background: none;
      }
    }
    &:after{
      content: '\2714';
      position: absolute;
      top: -8%;
      right: -3%;
      color:#c19b62;
      background: #fff;
    }
  }
  .table-title{
    min-height: 40px;
    border-bottom: 1px solid #e6ebf5;
    box-sizing: border-box;
    margin-bottom: 8px;
    background: #fafafa;
    padding-top: 10px;
    &.title-name{
      margin-top: -1px;
    }
  }
  .data-style{
    display: flex;
    justify-content: center;
    & > span{
      width: 25%;
      text-align: center;
    }
  }

}

</style>

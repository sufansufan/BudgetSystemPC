<template>
  <div class="budget-analysis">
    <router-view/>
    <template v-if="$route.params.id === undefined">
      <div class="select-tools">
        <div>
          <div>
            <div class="month-range">
              <el-date-picker
                ref="startMonth"
                :editable="false"
                v-model="select.budgetStartDateString"
                name="startMonth"
                type="month"
                placeholder="选择预算起始月份"
                value-format="yyyy-MM"
                @blur="monthRangeBlur"
              />
              <span class="month-range-separator">至</span>
              <el-date-picker
                ref="endMonth"
                :editable="false"
                v-model="select.budgetEndDateString"
                name="endMonth"
                type="month"
                placeholder="选择预算结束月份"
                value-format="yyyy-MM"
                @blur="monthRangeBlur"
              />
            </div>
          </div>
          <div>
            <ele-multi-cascader
              :options="constant.office"
              v-model="select.officeIds"
              :props="{value: 'id', label: 'name', children: 'children'}"
              style="width: 465px;"
              placeholder="请选择部门"
            />
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
            <el-select v-model="select.showWay" placeholder="请选择">
              <el-option
                v-for="item in constant.budget_summary_analyze_show_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div class="btn">
          <div>
            <el-button type="primary" icon="el-icon-search" @click="fetchData('search')">搜索</el-button>
          </div>
          <div>
            <el-button icon="el-icon-refresh" @click="resetSearch">重置搜索条件</el-button>
          </div>
          <div>
            <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
          </div>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="dataList.list"
        :key="key"
        stripe
        element-loading-text="Loading"
        highlight-current-row
        fit
      >
        <el-table-column label="年月" width="135">
          <template slot-scope="scope">
            {{ scope.row.budgetStartEndDateString }}
            <div v-show="isTableLast(scope.$index)" class="table-total">
              <b>合计：</b>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="部门">
          <template slot-scope="scope">
            {{ scope.row.officeName }}
            <div v-show="isTableLast(scope.$index)" class="table-total"/>
          </template>
        </el-table-column>
        <template v-for="(item, index) in dataList.columnList">
          <template v-for="(child, key) in item.titles">
            <el-table-column :key="child.id" :label="child.name">
              <template slot-scope="scope">
                <div>{{ scope.row.budgets[index].datas[key] }}</div>
                <div v-show="isTableLast(scope.$index)" class="table-total">
                  <div v-if="item.amounts[key] !== ''">
                    <count-num :num="+item.amounts[key]" :size="16" prefix="￥"/>
                  </div>
                </div>
              </template>
            </el-table-column>
          </template>
        </template>
      </el-table>
      <el-pagination
        v-show="count"
        :page-sizes="pageSizes"
        :page-size="limit"
        :total="count"
        :current-page="page"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tables from '@/mixin/tables'
import { getBudgetAnalyzeList, exportBudgetAnalyzeList } from '@/api/budgetAnalysis'
import CountNum from '@/components/Plugins/CountNum'
import { exportExcel } from '@/utils'
export default {
  components: {
    CountNum
  },
  mixins: [tables],
  data() {
    return {
      listLoading: true,
      budgetLevel: [],
      select: {
        budgetStartDateString: '',
        budgetEndDateString: '',
        officeIds: [],
        budgetLevelIds: [1],
        showWay: ''
      },
      dataList: {},
      key: 1
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'constant'])
  },
  created() {
    this.select.officeIds = [this.userInfo.office.id]
    this.$store.dispatch('GetConstant', ['office', 'project', 'budget_summary_analyze_show_type']).then(() => {
      this.select.showWay = this.constant.budget_summary_analyze_show_type[0].value
      this.initSearchCriteria()
      this.fetchData()
    })
  },
  methods: {
    exportExcel() {
      const params = {
        Loading: true,
        ...this.select,
        budgetLevelIds: this.select.budgetLevelIds.join(',') || '1',
        officeIds: this.select.officeIds.join(',')
      }
      if (!params.officeIds) {
        this.$message.error('请选择部门')
        return
      }
      exportBudgetAnalyzeList({ ...params }).then(res => {
        exportExcel(res, '我的预算/预算外')
      })
    },
    isTableLast(index) {
      return index === this.dataList.list.length - 1
    },
    fetchData(type) {
      type === 'search' && (this.page = 1)
      const params = {
        page: this.page,
        limit: this.limit,
        ...this.select,
        budgetLevelIds: this.select.budgetLevelIds.join(',') || '1',
        officeIds: this.select.officeIds.join(',')
      }
      if (!params.officeIds) {
        this.$message.error('请选择部门')
        return
      }
      this.listLoading = true
      getBudgetAnalyzeList(params).then(res => {
        this.listLoading = false
        const { count, dataList, columnList } = res.data
        this.count = count
        this.dataList = {
          list: dataList,
          columnList
        }
        this.key = this.key + 1
      })
    },
    delBudget(id) {
      this.$confirm('此操作将永久删除该预算, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteBudget({ ids: id }).then(() => {
        //   this.$message.success('删除成功')
        //   this.fetchData()
        // })
      }).catch(() => { })
    },
    getSummaries() {
    },
    reset() {
      this.select = {
        budgetBelongDateString: '',
        officeId: '',
        createByName: '',
        state: ''
      }
    }
  }
}
</script>

<style lang="scss">
.budget-analysis {
  .el-table {
    tr:last-child {
      td {
        padding-bottom: 60px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.budget-analysis {
  .table-total {
    background: #f3f5f7 !important;
    border-top: 1px solid #e6ebf5;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: block;
    height: 53px;
    color: #444;
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
      }
    }
  }
}
</style>

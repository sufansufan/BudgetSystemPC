<template>
  <div class="budget-approval">
    <router-view/>
    <template v-if="!$route.params.id">
      <el-tabs v-model="activeName" :lazy="true" :before-leave="tabBeforeClick">
        <el-tab-pane v-if="checkPermission(['5'])" label="主管预算内视图" name="innerView"/>
        <el-tab-pane v-if="checkPermission(['6'])" label="主管预算外视图" name="externaView"/>
        <el-tab-pane v-if="checkPermission(['7'])" label="后勤视图" name="logistics"/>
        <el-tab-pane v-if="checkPermission(['8'])" label="校长视图" name="headmaster"/>
      </el-tabs>
      <div class="select-tools">
        <div>
          <div>
            <el-date-picker
              v-model="select.budgetBelongDateString"
              type="month"
              value-format="yyyy-MM"
              placeholder="选择预算月份"
            />
          </div>
          <div v-show="activeName !== 'headmaster'">
            <el-cascader
              :options="constant.office"
              :props="{value: 'id', label: 'name'}"
              v-model="select.officeId"
              change-on-select
              placeholder="部门"
              clearable
            />
          </div>
          <div v-show="activeName === 'headmaster'">
            <el-input v-model.trim="select.budgetSummaryName" placeholder="请输入预算名称"/>
          </div>
          <div v-show="activeName !== 'logistics'">
            <el-select v-model="select.state" placeholder="请选择状态">
              <el-option
                v-for="item in constant.budget_summary_state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-input v-model.trim="select.createByName" placeholder="请输入制表人"/>
          </div>
        </div>
        <div class="btn">
          <div>
            <el-button type="primary" icon="el-icon-search" @click="fetchData('search')">搜索</el-button>
          </div>
          <div>
            <el-button icon="el-icon-refresh" @click="resetSearch">重置搜索条件</el-button>
          </div>
          <div v-if="activeName === 'externaView'">
            <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
          </div>
        </div>
      </div>
      <el-table
        v-loading="listLoading"
        :data="dataList"
        :key="key"
        stripe
        element-loading-text="Loading"
        highlight-current-row
        fit
        @selection-change="val => multipleSelection = val"
      >
        <template v-for="item in tableHead[activeName]">
          <template v-if="item === 'selection'">
            <el-table-column
              :key="item"
              :selectable="row => row.isMergerSummary"
              type="selection"
              width="55"
            />
          </template>
          <template v-else-if="item === '状态'">
            <el-table-column :key="item" :label="item">
              <template slot-scope="scope">
                <div v-html="scope.row[item]"/>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column :key="item" :label="item">
              <template slot-scope="scope">
                <div>{{ scope.row[item] }}</div>
              </template>
            </el-table-column>
          </template>
        </template>
        <el-table-column label="操作" width="170" fixed="right">
          <template slot-scope="scope">
            <template v-if="activeName === 'innerView'">
              <el-button
                type="text"
                icon="el-icon-search"
                @click="$router.push({path: `/mybudget/detail/${scope.row.id}`})"
              >查看</el-button>
              <template v-if="scope.row.whetherAudit">
                <el-button type="text" icon="el-icon-check" @click="rowAudit(scope.row)">审批</el-button>
              </template>
              <template v-if="checkPermission(['11'])">
                <el-button
                  v-if="scope.row.whetherDelete"
                  type="text"
                  icon="el-icon-delete"
                  @click="delBudget(scope.row.id)"
                >删除</el-button>
              </template>
              <template v-if="checkPermission(['24'])">
                <el-button
                  :disabled="!scope.row.isMergerSummary"
                  type="text"
                  icon="el-icon-printer"
                  @click="printingForm(scope.row.id, 'reserveFundPrint')"
                >打印备用金申请单</el-button>
              </template>
            </template>
            <template v-else-if="activeName === 'externaView'">
              <el-button
                type="text"
                icon="el-icon-search"
                @click="$router.push({path: `/mybudget/budgetoutdetail/${scope.row.id}`})"
              >查看</el-button>
              <template v-if="scope.row.whetherAudit">
                <el-button type="text" icon="el-icon-check" @click="rowAudit(scope.row)">审批</el-button>
              </template>
              <template v-if="checkPermission(['11'])">
                <el-button
                  v-if="scope.row.whetherDelete"
                  type="text"
                  icon="el-icon-delete"
                  @click="delBudget(scope.row.id)"
                >删除</el-button>
              </template>
              <template v-if="checkPermission(['26'])">
                <el-button
                  :disabled="!scope.row.isMergerSummary"
                  type="text"
                  icon="el-icon-printer"
                  @click="printingForm(scope.row.id, 'paymentFormPrint')"
                >打印付款申请单</el-button>
              </template>
            </template>
            <template v-else-if="activeName === 'logistics'">
              <el-button :disabled="!scope.row.notAuditSum" type="text" icon="el-icon-check" @click="rowAudit(scope.row)">审批</el-button>
            </template>
            <template v-else-if="activeName === 'headmaster'">
              <el-button
                type="text"
                icon="el-icon-search"
                @click="$router.push({path: `/mybudget/detail/${scope.row.id}`})"
              >查看</el-button>
              <template v-if="checkPermission(['12'])">
                <el-button
                  v-if="scope.row.whetherAudit"
                  type="text"
                  icon="el-icon-check"
                  @click="rowAudit(scope.row)"
                >审批</el-button>
              </template>
              <template v-if="checkPermission(['13'])">
                <el-button type="text" icon="el-icon-refresh" @click="delBudget(scope.row.id)">撤销</el-button>
              </template>
              <template v-if="checkPermission(['14'])">
                <el-button
                  v-if="scope.row.whetherDelete"
                  type="text"
                  icon="el-icon-delete"
                  @click="delBudget(scope.row.id)"
                >删除</el-button>
              </template>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="bom-btns">
        <template v-if="activeName === 'innerView'">
          <el-tooltip
            :disabled="hasGenerateBudgetBtn"
            content="请选择同年月、审核通过且后勤审批完成的预算进行汇总"
            placement="top"
            effect="light"
          >
            <el-button
              v-if="checkPermission(['9'])"
              type="primary"
              icon="el-icon-tickets"
              @click="generateBudgetSummary"
            >生成汇总预算</el-button>
          </el-tooltip>
          <template v-if="checkPermission(['23'])">
            <el-button
              :disabled="!multipleSelection.length"
              type="primary"
              icon="el-icon-printer"
              @click="printingForm('all', 'reserveFundPrint')"
            >批量打印备用金申请单</el-button>
          </template>
        </template>
        <template v-else-if="activeName === 'externaView' && checkPermission(['25'])">
          <el-button
            :disabled="!multipleSelection.length"
            type="primary"
            icon="el-icon-printer"
            @click="printingForm('all', 'paymentFormPrint')"
          >批量打印付款申请单</el-button>
        </template>
        <template v-else-if="activeName === 'logistics'">
          <el-button :disabled="!logisticsDisabled" type="primary" icon="el-icon-check" @click="allAudit">批量审批</el-button>
        </template>
      </div>
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
    <reserve-fund ref="reserveFundPrint" :print-list="reserveFundPrintList"/>
    <payment-form ref="paymentFormPrint" :print-list="paymenFromPrintList"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tables from '@/mixin/tables'
import { getBudgetExamineList, printingReserveFund, printingPaymentForm } from '@/api/budgetApproval'
import { deleteBudget, getBudgetOutList, exportFindBudgetOutList } from '@/api/myBudget'
import { parseTime, exportExcel } from '@/utils'
import ReserveFund from '@/components/Print/ReserveFund'
import PaymentForm from '@/components/Print/PaymentForm'
export default {
  components: {
    ReserveFund,
    PaymentForm
  },
  mixins: [tables],
  data() {
    return {
      listLoading: true,
      key: 1,
      activeName: 'innerView',
      dataList: [],
      tableHead: {
        innerView: ['selection', '年月', '部门', '状态', '制表人', '制表日期', '审核人', '审批日期', '审批编号'],
        externaView: ['selection', '年月', '部门', '状态', '制表人', '制表日期', '审批编号'],
        logistics: ['selection', '年月', '部门', '状态', '制表人', '制表日期'],
        headmaster: ['年月', '预算名称', '状态', '制表人', '制表日期', '审核人', '审批日期']
      },
      multipleSelection: [], // 多选操作
      select: {
        budgetBelongDateString: '', // 预算所属年月期  精确到月 字符串
        officeId: [], // 部门id 字符串
        createByName: '', // 制表人姓名
        budgetSummaryName: '', // 预算名称
        state: '', // 审核状态
        type: 1 // 1.预算内视图列表 2.预算外视图列表 3.后勤视图列表 4.校长视图列表
      },
      reserveFundPrintList: [],
      paymenFromPrintList: []
    }
  },
  computed: {
    ...mapGetters(['menuIds', 'userInfo', 'constant']),
    hasGenerateBudgetBtn() {
      const { budgetBelongDateString } = this.multipleSelection[0] || {}
      return !!this.multipleSelection.length && this.multipleSelection.every(item => item.isMergerSummary && item.budgetBelongDateString === budgetBelongDateString)
    },
    logisticsDisabled() {
      return this.multipleSelection.reduce((one, two) => {
        return one + two.notAuditSum
      }, 0)
    }
  },
  watch: {
    activeName() {
      this.key = this.key + 1
    }
  },
  created() {
    const tabName = this.$route.query.tab
    this.activeName = this.hasPermission(tabName)
    this.$store.dispatch('GetConstant', ['office', 'budget_summary_state'])
  },
  methods: {
    exportExcel() {
      const { budgetBelongDateString, officeId, createByName, state } = this.select
      const office = JSON.parse(JSON.stringify(officeId))
      const params = {
        Loading: true,
        page: this.page,
        limit: this.limit,
        applyDate: budgetBelongDateString, // 预算申请时间
        officeId: office.length ? office.pop() : '', // 部门id
        applyPerson: createByName, // 申请人
        status: state, // 状态
        type: 2
      }
      exportFindBudgetOutList({ ...params }).then(res => {
        exportExcel(res, '预算审批/预算外')
      })
    },
    hasPermission(tabName) {
      const POWER = {
        innerView: '5',
        externaView: '6',
        logistics: '7',
        headmaster: '8'
      }
      const powerArr = []
      for (const i in POWER) {
        if (this.menuIds.some(item => item === POWER[i])) {
          powerArr.push(i)
        }
      }
      const tabKeys = Object.keys(POWER)
      if (powerArr.length) {
        if (!tabName) tabName = powerArr[0]
        if (!powerArr.includes(tabName) || !tabKeys.includes(tabName)) {
          this.tabBeforeClick(powerArr[0])
          return powerArr[0]
        }
        return this.getTabData(tabName)
      } else {
        this.$message.error('你无权限访问此视图')
      }
    },
    getTabData(tabName) {
      const config = {
        innerView: 1,
        externaView: 2,
        logistics: 3,
        headmaster: 4
      }
      this.select.type = config[tabName] || 1
      this.page = 1
      this.select.type === 2 ? this.fetchBudgetOutData() : this.fetchData()
      return tabName
    },
    printingForm(ids, type) {
      if (ids === 'all') ids = this.multipleSelection.map(item => item.id).join(',')
      if (type === 'reserveFundPrint') {
        printingReserveFund({ Loading: true, ids }).then(res => {
          this.reserveFundPrintList = res.data.dataMapList
          this.$nextTick(() => {
            this.$print(this.$refs[type])
          })
        })
      } else {
        printingPaymentForm({ ids }).then(res => {
          this.paymenFromPrintList = res.data.myBudgetOutInfoList
          this.$nextTick(() => {
            this.$print(this.$refs[type])
          })
        })
      }
    },
    printingPaymentForm(ids) {
      if (ids === 'all') {
        ids = this.multipleSelection.map(item => item.id).join(',')
      }
      printingReserveFund({ ids }).then(res => {
        this.reserveFundPrintList = res.data.dataMapList
        this.$nextTick(() => {
          this.$print(this.$refs.reserveFundPrintDom)
        })
      })
    },
    fetchData(type) {
      if (type === 'search') this.page = 1
      if (this.activeName === 'externaView') {
        this.fetchBudgetOutData()
        return
      }
      const office = JSON.parse(JSON.stringify(this.select.officeId))
      const params = {
        page: this.page,
        limit: this.limit,
        ...this.select,
        officeId: office.length ? office.pop() : ''
      }
      this.listLoading = true
      getBudgetExamineList(params).then(res => {
        this.listLoading = false
        const { list, count } = res.data
        this.count = count
        const allowTabs = ['innerView', 'logistics']
        if (allowTabs.includes(this.activeName)) {
          const { notAduits = [] } = list.length && list[0].budgetSummary
          notAduits.map((item, index) => {
            const { budgetLevelName } = item
            if (!this.tableHead[this.activeName].includes(budgetLevelName)) {
              this.tableHead[this.activeName].splice(2 + index, 0, budgetLevelName)
            }
          })
        }
        this.dataList = list.map(item => {
          const { id: rowId, budgetSummary: { id, state, stateName, approvalNo, whetherAudit, whetherDelete, whetherEdit, isMergerSummary, budgetBelongDateString, createDateString, auditDateString, notAduits, name: budgetName, office, createBy, nowNodeBy: { id: nowNodeId }, auditBy } } = item
          item = {
            id,
            rowId,
            state,
            nowNodeId,
            isMergerSummary,
            budgetBelongDateString,
            whetherAudit,
            whetherDelete,
            whetherEdit,
            '审批编号': approvalNo,
            '年月': budgetBelongDateString,
            '预算名称': budgetName,
            '部门': office ? office.name : '',
            '状态': this.renderStateTag(stateName),
            '制表人': createBy ? createBy.name : '',
            '制表日期': createDateString,
            '审核人': auditBy ? auditBy.name : '',
            '审批日期': auditDateString
          }
          var num = 0
          notAduits.forEach(child => {
            const { notAudit, countNum } = child
            item[child.budgetLevelName] = notAudit + ' / ' + countNum
            num += Number(notAudit)
          })
          item.notAuditSum = num
          return item
        })
      })
    },
    fetchBudgetOutData() {
      const { budgetBelongDateString, officeId, createByName, state } = this.select
      const office = JSON.parse(JSON.stringify(officeId))
      const params = {
        page: this.page,
        limit: this.limit,
        applyDate: budgetBelongDateString, // 预算申请时间
        officeId: office.length ? office.pop() : '', // 部门id
        applyPerson: createByName, // 申请人
        status: state, // 状态
        type: 2
      }
      getBudgetOutList(params).then(res => {
        this.listLoading = false
        const { list, count } = res.data
        this.count = count
        this.dataList = list.map(item => {
          const { id, approvalNo, createDate, officeName, status, statusLable, createUserName, whetherAudit, whetherDelete, whetherEdit, whetherSubmit } = item
          return {
            id,
            state: status,
            isMergerSummary: status === '4',
            whetherAudit,
            whetherDelete,
            whetherEdit,
            whetherSubmit,
            '年月': parseTime(createDate, 'y-m'),
            '部门': officeName,
            '状态': this.renderStateTag(statusLable),
            '制表人': createUserName,
            '制表日期': parseTime(createDate),
            '审批编号': approvalNo
          }
        })
      })
    },
    tabBeforeClick(name) {
      this.$router.push({ query: { tab: name } })
    },
    delBudget(id) {
      this.$confirm('此操作将永久删除该预算, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBudget({ ids: id }).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => { })
    },
    rowAudit({ id, rowId: rid }) {
      const routeParam = {}
      switch (this.activeName) {
        case 'logistics':
          routeParam.name = 'LogisticsAudit'
          routeParam.params = { id }
          break
        case 'externaView':
          routeParam.name = 'ExternaViewAudit'
          routeParam.params = { id }
          break
        case 'headmaster':
          routeParam.name = 'HeadmasterAudit'
          routeParam.params = { id }
          break
        default:
          routeParam.name = 'MybudgetAudit'
          routeParam.params = { id, rid }
      }
      this.$router.push(routeParam)
    },
    allAudit() {
      if (!this.multipleSelection.length) {
        this.$message.error('请勾选需要审批的项目')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.rowAudit({ id: ids })
    },
    generateBudgetSummary() {
      if (!this.hasGenerateBudgetBtn) return false
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$router.push({ name: 'BudgetSummaryMerge', params: { id: ids } })
    }
  }
}
</script>

<style lang="scss" scoped>
.budget-approval {
  .bom-btns {
    margin-bottom: 20px;
  }
}
</style>

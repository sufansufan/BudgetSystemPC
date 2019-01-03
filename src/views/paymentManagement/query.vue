<template>
  <div>
    <div class="select-tools">
      <div>
        <div>
          <el-date-picker
            v-model="times"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyyMMdd"
          />
        </div>
        <!-- <div>
            <el-select v-model="select.payApplyState" placeholder="请选择收支标志">
              <el-option
                v-for="item in constant.revenue_expenditure_identification"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
        </div>-->
        <div>
          <el-autocomplete
            v-model="inpAccountVal"
            :fetch-suggestions="querySearchAccount"
            :trigger-on-focus="false"
            placeholder="请输入户名"
            @select="handleSelectAccount"
          />
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
      :data="dataList"
      stripe
      element-loading-text="Loading"
      highlight-current-row
      fit
    >
      <el-table-column prop="paymentDate" label="交易日期" width="135"/>
      <el-table-column prop="paymentTime" label="交易时间" width="135"/>
      <el-table-column prop="paymentFlag" label="收支标志" width="135"/>
      <el-table-column prop="flowNumber" label="流水号" width="135"/>
      <el-table-column prop="flowNo" label="流水序号" width="135"/>
      <el-table-column prop="accountName" label="户名" width="135"/>
      <el-table-column prop="amount" label="交易金额" width="135"/>
      <el-table-column prop="receiveBankName" label="对方开户行行名" width="200"/>
      <el-table-column prop="receiveNo" label="对方账号" width="135"/>
      <el-table-column prop="receiveBankName" label="对方户名" width="135"/>
      <el-table-column prop="postscript" label="附言" width="200"/>
      <el-table-column prop="remark" label="备注" width="200"/>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tables from '@/mixin/tables'
import { getPayQueryList, getAccountAllList } from '@/api/paymentManagement'
import { parseTime } from '@/utils'
export default {
  mixins: [tables],
  data() {
    return {
      listLoading: true,
      dataList: [],
      accountList: [],
      inpAccountVal: '',
      times: [],
      select: {
        payApplyState: '',
        payAccountNumber: '',
        startDateString: '',
        endDateString: ''
      }
    }
  },
  computed: {
    ...mapGetters(['constant'])
  },
  created() {
    this.$store.dispatch('GetConstant', 'revenue_expenditure_identification')
    this.setDefaultTime()
    this.getAccountList().then(() => {
      this.fetchData()
    })
  },
  methods: {
    setDefaultTime() {
      const defStart = new Date() - 3600 * 1000 * 24 * 7
      const defEnd = new Date()
      this.times = [parseTime(defStart, 'ymd'), parseTime(defEnd, 'ymd')]
    },
    exportExcel() {

    },
    getAccountList(val = '') {
      return getAccountAllList({ accountName: val, accountState: 1 }).then(res => {
        this.accountList = res.data.list
        if (this.accountList.length) {
          const { name, value } = this.accountList[0]
          this.inpAccountVal = name
          this.select.payAccountNumber = value
        }
      })
    },
    querySearchAccount(queryString, cb) {
      var resList = this.accountList
      var results = queryString ? resList.filter(item => item.name.toLowerCase().includes(queryString.toLowerCase())) : resList
      cb(results)
    },
    handleSelectAccount(item) {
      this.select.payAccountNumber = item.value
    },
    fetchData(type) {
      type === 'search' && (this.page = 1)
      const [start, end] = this.times
      this.select.startDateString = start
      this.select.endDateString = end
      const params = {
        page: this.page,
        limit: this.limit,
        ...this.select
      }
      this.listLoading = true
      getPayQueryList(params).then(res => {
        this.listLoading = false
        const { count, list } = res.data
        this.count = count
        this.dataList = list
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>

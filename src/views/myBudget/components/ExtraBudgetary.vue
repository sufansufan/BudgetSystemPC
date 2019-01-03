<template>
  <div class="extra-budgetary">
    <div class="select-tools">
      <div>
        <div>
          <el-date-picker
            v-model="select.applyDate"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月"
          />
        </div>
        <div>
          <el-cascader
            :options="constant.office"
            :props="{value: 'id', label: 'name'}"
            v-model="select.officeId"
            change-on-select
            placeholder="部门"
            clearable
          />
        </div>
        <div>
          <el-input v-model.trim="select.createByName" placeholder="请输入制表人"/>
        </div>
        <div>
          <el-select v-model="select.status" placeholder="请选择状态">
            <el-option
              v-for="item in constant.budget_summary_state"
              :key="item.value"
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
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="$router.push({name:'BudgetOutCreate', params: {id: ''}})"
          >新增</el-button>
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
      <el-table-column prop="yearMonth" label="年月" width="135"/>
      <el-table-column prop="officeName" label="部门"/>
      <el-table-column prop="applyReason" label="申请事由"/>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-html="scope.row.statusLable"/>
        </template>
      </el-table-column>
      <el-table-column prop="createUserName" label="申请人"/>
      <el-table-column prop="createDate" label="申请日期" width="135"/>
      <el-table-column prop="auditByName" label="审核人"/>
      <el-table-column prop="auditDate" label="审批日期" width="135"/>
      <el-table-column label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-search"
            @click="$router.push({name: 'BudgetOutDetail', params: {id: scope.row.id}})"
          >查看</el-button>
          <el-button
            :disabled="!scope.row.whetherEdit"
            type="text"
            icon="el-icon-edit"
            @click="$router.push({name: 'BudgetOutEdit', params: {id: scope.row.id, whetherSubmit: scope.row.whetherSubmit}})"
          >编辑</el-button>
          <el-button
            :disabled="!scope.row.whetherDelete"
            type="text"
            icon="el-icon-delete"
            @click="delBudget(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
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
import { getBudgetOutList, deleteBudgetOut, exportFindBudgetOutList } from '@/api/myBudget'
import { parseTime } from '@/utils'
import { exportExcel } from '@/utils'
export default {
  mixins: [tables],
  data() {
    return {
      listLoading: true,
      select: {
        applyDate: '',
        officeId: [],
        applyPerson: '',
        status: '',
        type: 1
      },
      dataList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'constant'])
  },
  created() {
    this.fetchData()
  },
  methods: {
    exportExcel() {
      const office = JSON.parse(JSON.stringify(this.select.officeId))
      const params = {
        Loading: true,
        ...this.select,
        officeId: office.length ? office.pop() : ''
      }
      exportFindBudgetOutList({ ...params }).then(res => {
        exportExcel(res, '我的预算/预算外')
      })
    },
    fetchData(type) {
      type === 'search' && (this.page = 1)
      const office = JSON.parse(JSON.stringify(this.select.officeId))
      const params = {
        page: this.page,
        limit: this.limit,
        ...this.select,
        officeId: office.length ? office.pop() : ''
      }
      this.listLoading = true
      getBudgetOutList(params).then(res => {
        this.listLoading = false
        const { count, list } = res.data
        this.count = count
        this.dataList = list.map(item => {
          item.yearMonth = parseTime(item.createDate, 'y-m')
          item.createDate = parseTime(item.createDate)
          item.auditDate = parseTime(item.auditDate)
          item.statusLable = this.renderStateTag(item.statusLable)
          return item
        })
      })
    },
    delBudget(id) {
      this.$confirm('此操作将永久删除该预算, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBudgetOut({ id }).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => { })
    }
  }
}
</script>

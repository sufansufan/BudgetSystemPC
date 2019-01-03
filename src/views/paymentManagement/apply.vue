<template>
  <div>
    <router-view/>
    <template v-if="$route.params.id === undefined">
      <div class="select-tools">
        <div>
          <div>
            <div class="month-range">
              <el-date-picker
                ref="startMonth"
                :editable="false"
                v-model="select.payApplyCreateDateStart"
                name="startMonth"
                type="month"
                placeholder="选择申请起始月份"
                value-format="yyyy-MM"
              />
              <span class="month-range-separator">至</span>
              <el-date-picker
                ref="endMonth"
                :editable="false"
                v-model="select.payApplyCreateDateEnd"
                name="endMonth"
                type="month"
                placeholder="选择申请结束月份"
                value-format="yyyy-MM"
              />
            </div>
          </div>
          <div>
            <el-input v-model="select.payAccountName" placeholder="请输入付款账户"/>
          </div>
          <div>
            <el-input v-model="select.applyByName" placeholder="请输入申请人"/>
          </div>
          <div>
            <div class="month-range">
              <el-date-picker
                ref="startMonth"
                :editable="false"
                v-model="select.payApplyPayDateStart"
                name="startMonth"
                type="month"
                placeholder="选择申请起始月份"
                value-format="yyyy-MM"
              />
              <span class="month-range-separator">至</span>
              <el-date-picker
                ref="endMonth"
                :editable="false"
                v-model="select.payApplyPayDateEnd"
                name="endMonth"
                type="month"
                placeholder="选择申请结束月份"
                value-format="yyyy-MM"
              />
            </div>
          </div>
          <div>
            <el-input v-model="select.applyNo" placeholder="请输入申请ID"/>
          </div>
          <div>
            <el-select v-model="select.payApplyState" placeholder="请选择状态">
              <el-option
                v-for="item in constant.pay_apply_state"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-input v-model="select.payByName" placeholder="请输入打款人"/>
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
              @click="$router.push({name: 'PaymentManagementCreate', params: { id: ''}})"
            >新增</el-button>
          </div>
          <div>
            <el-button type="primary" icon="el-icon-upload">批量导入</el-button>
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
        <el-table-column prop="applyNo" label="申请ID" width="135"/>
        <el-table-column prop="remarks" label="备注"/>
        <el-table-column prop="applyByName" label="申请人" width="135"/>
        <el-table-column prop="createDate" label="申请日期" width="135"/>
        <el-table-column prop="payByName" label="打款人" width="135"/>
        <el-table-column prop="auditDate" label="审核日期" width="135"/>
        <el-table-column prop="payDate" label="打款日期" width="135"/>
        <el-table-column label="状态" width="135">
          <template slot-scope="scope">
            <div v-html="scope.row.stateHtm"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                icon="el-icon-search"
                @click="$router.push({name: 'PaymentManagementDetail', params: {id: scope.row.payApplyId}})"
              >查看</el-button>
              <template v-if="scope.row.whetherMakeMoney">
                <el-button
                  type="text"
                  icon="el-icon-check"
                  @click="$router.push({name: 'PaymentManagementAudit', params: {id: scope.row.payApplyId}})"
                >打款</el-button>
              </template>
              <template v-if="scope.row.whetherDelete">
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="deletePayApply(scope.row.payApplyId)"
                >删除</el-button>
              </template>
            </div>
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
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tables from '@/mixin/tables'
import { getPayApplyList, deletePayApply } from '@/api/paymentManagement'
import { parseTime } from '@/utils'
export default {
  mixins: [tables],
  data() {
    return {
      listLoading: true,
      dataList: [],
      select: {
        payAccountName: '',
        applyByName: '',
        payByName: '',
        applyNo: '',
        payApplyState: '',
        payApplyCreateDateStart: '',
        payApplyCreateDateEnd: '',
        payApplyPayDateStart: '',
        payApplyPayDateEnd: ''
      }
    }
  },
  computed: {
    ...mapGetters(['constant'])
  },
  created() {
    this.$store.dispatch('GetConstant', 'pay_apply_state')
    this.fetchData()
  },
  methods: {
    exportExcel() {

    },
    deletePayApply(id) {
      this.$confirm('此操作将永久删除该付款申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePayApply({
          Loading: true,
          ids: id
        }).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => { })
    },
    fetchData(type) {
      type === 'search' && (this.page = 1)
      const params = {
        page: this.page,
        limit: this.limit,
        ...this.select
      }
      this.listLoading = true
      getPayApplyList(params).then(res => {
        this.listLoading = false
        const { count, list } = res.data
        this.count = count
        this.dataList = list.map(item => {
          item.auditDate = parseTime(item.auditDate)
          item.payDate = parseTime(item.payDate)
          item.createDate = parseTime(item.createDate)
          item.stateHtm = this.renderStateTag(item.stateName)
          return item
        })
      })
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <div class="payment-management-settings">
    <div class="select-tools">
      <div>
        <div>
          <el-input v-model="select.accountName" placeholder="请输入户名"/>
        </div>
        <div>
          <el-input v-model="select.accountNumber" placeholder="请输入账号"/>
        </div>
        <div>
          <el-select v-model="select.accountState" placeholder="请选择状态">
            <el-option
              v-for="item in constant.account_state"
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
          <el-button type="primary" icon="el-icon-plus" @click="addAccount">新增</el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-download" @click="exportExcel">导出</el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-sort" @click="updateAccount()">更新信息</el-button>
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
      <el-table-column prop="accountName" label="户名"/>
      <el-table-column prop="accountNumber" label="账号"/>
      <el-table-column prop="balance" label="余额" width="135"/>
      <el-table-column prop="openAccountDate" label="开户日期" width="135"/>
      <el-table-column prop="typeName" label="账户类型" width="135"/>
      <el-table-column prop="openBank" label="开户行"/>
      <el-table-column prop="updateDate" label="更新日期" width="135"/>
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
              icon="el-icon-warning"
              @click="switchAccountState(scope.row.accountId, scope.row.state)"
            >{{ scope.row.state === '1' ? '停用' : '启用' }}</el-button>
            <template v-if="scope.row.whetherEdit">
              <el-button type="text" icon="el-icon-edit" @click="editAccount(scope.row)">编辑</el-button>
            </template>
            <template v-if="scope.row.whetherDelete">
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="delAccount(scope.row.accountId)"
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
    <Dialog ref="accountDialog" width="500px" top="200px" class="account-dialog">
      <el-form
        ref="accountInfo"
        :model="accountInfo"
        :rules="accountRules"
        label-position="right"
        size="medium"
        label-width="50px"
      >
        <el-form-item label="户名" prop="accountName">
          <el-input v-model="accountInfo.accountName"/>
        </el-form-item>
        <el-form-item label="账号" prop="accountNumber">
          <el-input v-model="accountInfo.accountNumber"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveAccount">确定</el-button>
          <el-button @click="changeDisplayDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tables from '@/mixin/tables'
import {
  getAccountList,
  addOrEditAccount,
  deleteAccount,
  updateAccount,
  editAccountState
} from '@/api/paymentManagement'
import { parseTime } from '@/utils'
import Dialog from '@/components/Plugins/Dialog'
export default {
  components: {
    Dialog
  },
  mixins: [tables],
  data() {
    return {
      listLoading: true,
      dataList: [],
      select: {
        accountState: '',
        accountName: '',
        accountNumber: ''
      },
      accountInfo: {
        id: '',
        accountName: '',
        accountNumber: ''
      },
      accountRules: {
        accountName: [{ required: true, message: '请输入户名', trigger: 'blur' }],
        accountNumber: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (!/^\d+$/.test(value)) {
                callback(new Error('请输入数字账号'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['constant'])
  },
  created() {
    this.$store.dispatch('GetConstant', 'account_state')
    this.fetchData()
  },
  methods: {
    exportExcel() {

    },
    changeDisplayDialog() {
      this.$refs.accountDialog.show = !this.$refs.accountDialog.show
    },
    addAccount() {
      this.$refs.accountDialog.setTitle('账户新增')
      this.changeDisplayDialog()
      this.accountInfo = {
        id: '',
        accountName: '',
        accountNumber: ''
      }
    },
    editAccount(row) {
      this.$refs.accountDialog.setTitle('账户编辑')
      this.changeDisplayDialog()
      const { accountId, accountName, accountNumber } = row
      this.accountInfo.id = accountId
      this.accountInfo.accountName = accountName
      this.accountInfo.accountNumber = accountNumber
    },
    switchAccountState(id, state) {
      const stateTips = state === '1' ? '停用' : '启用'
      this.$confirm(`此操作将${stateTips}该账户, 是否继续?`, '提示', {
        confirmButtonText: stateTips,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editAccountState({
          Loading: true,
          account: {
            id,
            state: state === '1' ? 2 : 1
          }
        }).then(() => {
          this.$message.success(`${stateTips}账户成功`)
          this.fetchData()
        })
      }).catch(() => { })
    },
    delAccount(id) {
      this.$confirm('此操作将永久删除该账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAccount({
          Loading: true,
          ids: id
        }).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => { })
    },

    updateAccount() {
      updateAccount({ Loading: true }).then(() => {
        this.$message.success('更新成功')
        this.fetchData()
      })
    },
    saveAccount() {
      this.$refs.accountInfo.validate().then(() => {
        addOrEditAccount({
          Loading: true,
          account: {
            ...this.accountInfo
          }
        }).then(() => {
          this.$message.success('保存成功')
          this.changeDisplayDialog()
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
      getAccountList(params).then(res => {
        this.listLoading = false
        const { count, list } = res.data
        this.count = count
        this.dataList = list.map(item => {
          item.updateDate = parseTime(item.updateDate)
          item.openAccountDate = parseTime(item.openAccountDate)
          item.stateHtm = this.renderStateTag(item.stateName)
          return item
        })
      })
    }
  }
}
</script>

<style lang="scss">
.payment-management-settings {
  .account-dialog {
    .el-form-item:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

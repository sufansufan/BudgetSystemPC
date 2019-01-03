<template>
  <div class="user-container">
    <div class="select-tools">
      <div>
        <div>
          <el-select v-model="select.isUseable" placeholder="状态" clearable>
            <el-option :value="true" label="启用"/>
            <el-option :value="false" label="停用"/>
          </el-select>
        </div>
        <div>
          <el-input v-model.trim="select.nameAndMobile" placeholder="用户名/手机号" clearable/>
        </div>
        <div>
          <el-select v-model="select.roleId" placeholder="角色" clearable>
            <el-option
              v-for="item in constant.role"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div>
          <el-cascader
            :options="constant.office"
            :props="departmentType"
            v-model="select.selectDepart"
            change-on-select
            placeholder="部门"
            clearable
          />
        </div>
      </div>
      <div class="btn">
        <div>
          <el-button type="primary" icon="el-icon-search" @click="fetchData('clear')">搜索</el-button>
        </div>
        <div>
          <el-button icon="el-icon-refresh" @click="resetSearch">重置搜索条件</el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="modify('add')">新增</el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-download" @click="exportExcal">导出</el-button>
        </div>
      </div>
    </div>
    <el-table v-loading="loading" :data="dataList" stripe element-loading-text="Loading" highlight-current-row fit>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="loginName" label="用户名"/>
      <el-table-column prop="no" label="工号"/>
      <el-table-column prop="mobile" label="手机号"/>
      <el-table-column prop="office.parent.name" label="部门归属"/>
      <el-table-column label="部门" prop="office.name" />
      <el-table-column prop="role.name" label="角色"/>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-html="scope.row.isUseableHtm"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="modify('edit', scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="deleteUser(scope.row.id)">删除</el-button>
          <el-button
            type="text"
            icon="el-icon-warning"
            @click="modifyStatus(scope.row)"
          >{{ scope.row.isUseable === true ? '停用' : '启用' }}</el-button>
          <el-button
            type="text"
            icon="el-icon-refresh"
            @click="resetPassword(scope.row.id)"
          >重置密码</el-button>
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
    <Dialog ref="dialog" width="50%" top="200px">
      <user-modify :edit-data="editData" @close="close"/>
    </Dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tables from '@/mixin/tables'
import { getUserManageList, editUserStatus, deleteUser, exportUserManageList, resetPassword } from '@/api/user'
import Dialog from '@/components/Plugins/Dialog'
import UserModify from './components/UserModify'
import { exportExcel } from '@/utils'
export default {
  name: 'UserManagement',
  components: {
    Dialog,
    UserModify
  },
  mixins: [tables],
  data() {
    return {
      select: {
        isUseable: '',
        nameAndMobile: '',
        roleId: '',
        officeId: '',
        childreOfficeId: '',
        selectDepart: []
      },
      dataList: [],
      editData: {},
      departmentType: {
        value: 'id',
        label: 'name'
      },
      loading: true
    }
  },
  computed: {
    ...mapGetters(['constant'])
  },
  created() {
    this.$store.dispatch('GetConstant', ['office', 'role']).then(() => {
      this.fetchData()
    })
  },
  methods: {
    fetchData(clear) {
      this.loading = true
      this.select.officeId = this.select.selectDepart && this.select.selectDepart[this.select.selectDepart.length - 1] || ''
      const params = {
        page: clear ? this.page = 1 : this.page,
        limit: this.limit,
        ...this.select
      }
      delete params.selectDepart
      getUserManageList(params).then(({ data }) => {
        this.loading = false
        this.count = data.count
        this.dataList = data.list
        this.dataList = this.dataList.map(item => {
          item.isUseableHtm = this.renderStateTag(item.isUseable ? '启用' : '停用')
          return item
        })
      })
    },
    modify(type, row) {
      if (type === 'add') {
        this.editData = {}
        this.$refs.dialog.setTitle('用户新增')
      } else if (type === 'edit') {
        this.editData = row
        this.$refs.dialog.setTitle('用户编辑')
      }
      this.$refs.dialog.show = true
    },
    modifyStatus(row) {
      this.$confirm('是否进行状态修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: row.id,
          isUseable: !row.isUseable
        }
        editUserStatus(param).then(res => {
          this.$message.success(res.msg)
          this.fetchData()
        })
      })
    },
    close() {
      this.$refs.dialog.show = false
      this.fetchData('clear')
    },
    deleteUser(id) {
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ id }).then(res => {
          this.$message.success(res.msg)
          this.fetchData()
        })
      })
    },
    resetPassword(id) {
      this.$confirm('是否重置密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword({ id }).then(res => {
          this.$message.success(res.msg)
          this.fetchData()
        })
      })
    },
    exportExcal() {
      this.select.officeId = this.select.selectDepart && this.select.selectDepart[this.select.selectDepart.length - 1] || ''
      const param = {
        ...this.select
      }
      delete param.selectDepart
      exportUserManageList({ Loading: true, ...param }).then(res => {
        exportExcel(res, '用戶管理')
      })
    }
  }
}
</script>

<style scoped>
</style>

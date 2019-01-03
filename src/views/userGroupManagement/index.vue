<template>
  <div class="user-group">
    <div class="select-tools">
      <div/>
      <div class="btn">
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="modify('add')">新增</el-button>
        </div>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="dataList"
      stripe
      element-loading-text="Loading"
      highlight-current-row
      fit
    >
      <el-table-column prop="name" label="用户组名称" width="320"/>
      <el-table-column prop="relevanceNumber" label="关联人数"/>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="modify('edit', scope.row)">编辑</el-button>
          <el-button
            v-if="scope.row.relevanceNumber === 0"
            type="text"
            icon="el-icon-delete"
            @click="deleteUserGroup(scope.row.id)"
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
    <Dialog ref="dialog" width="50%">
      <div class="user-dialog-content">
        <div>
          <span>用户组名称</span>
          <el-input v-model.trim="userGroupInfo.name" placeholder="请输入"/>
        </div>
        <div>
          <el-tree
            ref="tree"
            :data="menuList"
            :props="defaultProps"
            :default-expand-all="true"
            :default-checked-keys="menuIdList"
            show-checkbox
            node-key="id"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="big" @click="$refs.dialog.show = false">取 消</el-button>
        <el-button type="primary" size="big" @click="editConfirm">确 定</el-button>
      </span>
    </Dialog>
  </div>
</template>

<script>
import { getRoleList, getAllMenu, getRoleMenuListById, addAndEditRole, deleteRoleGroup } from '@/api/userGroup'
import tables from '@/mixin/tables'
import Dialog from '@/components/Plugins/Dialog'
export default {
  name: 'UserGroupManagement',
  components: {
    Dialog
  },
  mixins: [tables],
  data() {
    return {
      dataList: [],
      menuList: [],
      menuIdList: [],
      userGroupInfo: {
        name: '',
        id: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      loading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      const param = {
        page: this.page,
        limit: this.limit
      }
      getRoleList(param).then(({ data }) => {
        this.loading = false
        this.dataList = data.list
        this.count = data.count
      })
    },
    getMenu() {
      getAllMenu().then(({ data }) => {
        this.menuList = data.list
      })
    },
    modify(type, row) {
      if (type === 'add') {
        this.menuIdList = []
        this.userGroupInfo = {
          name: '',
          id: ''
        }
        this.$refs.dialog.setTitle('用户组新增')
        this.getMenu()
      } else {
        this.$refs.dialog.setTitle('用户组编辑')
        this.userGroupInfo = {
          name: row.name,
          id: row.id
        }
        this.getMenuFromId(row.id)
      }
      this.$refs.dialog.show = true
    },
    editConfirm() {
      const roleList = []
      this.$refs.tree.getCheckedNodes(false, true).filter(item => {
        roleList.push(item.id)
      })
      if (this.userGroupInfo.name === '') {
        this.$message.warning('请输入用户组名称')
        return
      }
      if (roleList.length === 0) {
        this.$message.warning('请至少勾选一项权限')
        return
      }
      const param = {
        Loading: true,
        ...this.userGroupInfo,
        roleList
      }
      addAndEditRole(param).then(res => {
        this.fetchData()
        this.$refs.dialog.show = false
        this.$message.success(res.msg)
      })
    },
    getMenuFromId(id) {
      this.menuIdList = []
      getRoleMenuListById({ id }).then(({ data }) => {
        this.menuList = data.list
        this.getMenuId(this.menuList)
      })
    },
    getMenuId(list) {
      list.forEach(item => {
        if (item.possessIs === true) {
          if (!item.children) {
            this.menuIdList.push(item.id)
          }
        }
        if (item.children) {
          this.getMenuId(item.children)
        }
      })
    },
    deleteUserGroup(id) {
      this.$confirm('此操作将永久删除该用户组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRoleGroup({ id }).then(() => {
          this.fetchData()
          this.$message.success('删除成功')
        })
      }).catch(() => { })
    }
  }
}
</script>

<style lang='scss'>
.user-group {
  .user-dialog-content {
    display: flex;
    justify-content: space-between;
    min-height: 600px;
    & > div {
      width: calc(50% - 11px);
    }
  }
}
</style>

<template>
  <div class="supplier-set">
    <div class="select-tools">
      <div>
        <div>
          <el-input v-model.trim="select.supplierName" placeholder="供应商名称" clearable/>
        </div>
        <div>
          <el-input v-model.trim="select.telephone" placeholder="电话" clearable/>
        </div>
        <div>
          <el-select v-model="select.supplierState" placeholder="状态" clearable>
            <el-option :value="1" label="启用"/>
            <el-option :value="2" label="停用"/>
          </el-select>
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
          <el-button type="primary" icon="el-icon-plus" @click="modify('add')">新增</el-button>
        </div>
      </div>
    </div>
    <el-table :data="dataList" stripe element-loading-text="Loading" highlight-current-row fit>
      <el-table-column prop="supplierName" label="供应商名称"/>
      <el-table-column prop="supplierTelephone" label="电话"/>
      <el-table-column prop="supplierContactsName" label="联系人"/>
      <el-table-column prop="updateDate" label="操作日期"/>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-html="scope.row.stateHtm"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="266" fixed="right">
        <template slot-scope="scope">
          <el-button :disabled="!scope.row.whetherEdit" type="text" icon="el-icon-edit" @click="modify('edit', scope.row)">编辑</el-button>
          <el-button :disabled="!scope.row.whetherDelete" type="text" icon="el-icon-delete" @click="deleteSupplier(scope.row.supplierId)">删除</el-button>
          <el-button
            type="text"
            icon="el-icon-warning"
            @click="modifyStatus(scope.row.supplierId, scope.row.state)"
          >{{ scope.row.state === '1' ? '停用' : '启用' }}</el-button>
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
    <Dialog ref="dialogSupplier" width="40%" top="250px">
      <el-form
        ref="supplierForm"
        :model="supplierForm"
        :rules="supplierRules"
        class="supplier-form"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model.trim="supplierForm.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="联系人" prop="contactsName">
          <el-input v-model.trim="supplierForm.contactsName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="供应商电话">
          <el-input v-model.trim="supplierForm.telephone" placeholder="请输入"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="big" @click="$refs.dialogSupplier.show = false">取 消</el-button>
        <el-button type="primary" size="big" @click="editConfirm">确 定</el-button>
      </span>
    </Dialog>
  </div>
</template>

<script>
import tables from '@/mixin/tables'
import Dialog from '@/components/Plugins/Dialog'
import { getSupplierList, editSupplier, deleteSupplier, editSupplierState } from '@/api/approvalSettings'
import { parseTime } from '@/utils'
export default {
  components: {
    Dialog
  },
  mixins: [tables],
  data() {
    return {
      select: {
        supplierName: '',
        telephone: '',
        supplierState: ''
      },
      dataList: [],
      supplierForm: {
        id: '',
        name: '',
        telephone: '',
        contactsName: ''
      },
      supplierFormDeep: {},
      supplierRules: {
        name: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
        contactsName: [{ required: true, message: '请输入联系人', trigger: 'blur' }]

      }
    }
  },
  created() {
    this.fetchData()
    this.supplierFormDeep = { ...this.supplierForm }
  },
  methods: {
    fetchData() {
      const params = {
        limit: this.limit,
        page: this.page,
        ...this.select
      }
      getSupplierList(params).then(({ data }) => {
        this.dataList = data.list
        this.count = data.count
        this.dataList = this.dataList.map(item => {
          item.stateHtm = this.renderStateTag(item.state === '1' ? '启用' : '停用')
          item.updateDate = parseTime(item.updateDate)
          return item
        })
      })
    },
    modify(type, row) {
      this.$refs.dialogSupplier.show = true
      if (type === 'edit') {
        const { supplierId, supplierName, supplierTelephone, supplierContactsName } = row
        this.supplierForm = {
          id: supplierId,
          name: supplierName,
          telephone: supplierTelephone,
          contactsName: supplierContactsName
        }
      } else {
        this.supplierForm = { ...this.supplierFormDeep }
      }
    },
    deleteSupplier(ids) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSupplier({ ids }).then(res => {
          this.$message.success(res.msg)
          this.fetchData()
        })
      })
    },
    modifyStatus(id, state) {
      editSupplierState({ supplier: { id, state: state === '1' ? '2' : '1' } }).then(res => {
        this.$message.success(res.msg)
        this.fetchData()
      })
    },
    editConfirm() {
      this.$refs.supplierForm.validate(valid => {
        if (valid) {
          editSupplier({ Loading: true, supplier: { ...this.supplierForm } }).then(res => {
            this.fetchData()
            this.$message.success(res.msg)
            this.$refs.dialogSupplier.show = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.supplier-set{
  .supplier-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      width: calc(50% - 10px);
      &:last-child{
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}

</style>

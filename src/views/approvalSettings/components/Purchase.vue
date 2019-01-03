<template>
  <div class="purchase">
    <div class="select-tools">
      <div>
        <div>
          <el-select v-model="select.type" placeholder="类别" clearable>
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div>
          <el-input v-model.trim="select.name" placeholder="名称" clearable/>
        </div>
        <div>
          <el-select v-model="select.isUseable" placeholder="状态" clearable>
            <el-option :value="true" label="启用"/>
            <el-option :value="false" label="停用"/>
          </el-select>
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
      </div>
    </div>
    <el-table :data="dataList" stripe element-loading-text="Loading" highlight-current-row fit>
      <el-table-column prop="propertyTypeName" label="类别"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="modelNumber" label="规格型号"/>
      <el-table-column prop="singlePrice" label="预算单价"/>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-html="scope.row.useableHtm"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="266" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="modify('edit', scope.row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="deletePurchase(scope.row.id)">删除</el-button>
          <el-button
            type="text"
            icon="el-icon-warning"
            @click="modifyStatus(scope.row.id, !scope.row.useable)"
          >{{ scope.row.useable === true ? '停用' : '启用' }}</el-button>
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
    <Dialog ref="dialog" width="40%" top="230px">
      <el-form
        ref="purchaseForm"
        :model="purchaseForm"
        :rules="purchaseRules"
        class="purchase-form"
      >
        <el-form-item label="类别" prop="propertyType">
          <el-select v-model="purchaseForm.propertyType" placeholder="类别">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="purchaseForm.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-select v-model="purchaseForm.supplierName" placeholder="请选择" clearable @change="getsupplierName($event)">
            <el-option
              v-for="item in supplierList"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model.trim="purchaseForm.brandName" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="供应商电话">
          <el-input v-model.trim="purchaseForm.supplierTelephone" disabled placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model.trim="purchaseForm.modelNumber" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="预算单价" prop="singlePrice">
          <el-input
            v-model.trim="purchaseForm.singlePrice"
            placeholder="请输入"
            @blur="purchaseForm.singlePrice = Number(purchaseForm.singlePrice).toFixed(2)"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="big" @click="$refs.dialog.show = false">取 消</el-button>
        <el-button type="primary" size="big" @click="editConfirm">确 定</el-button>
      </span>
    </Dialog>
  </div>
</template>

<script>
import { validateJustFloat } from '@/utils/validate'
import { getDictList } from '@/api'
import { getPurchaseInfoList, addAndEditBudgetClass, editPurchaseInfoStatus, deletePurchaseInfo } from '@/api/approvalSettings'
import { getSupplierList } from '@/api/approvalSettings'
import tables from '@/mixin/tables'
import Dialog from '@/components/Plugins/Dialog'
export default {
  components: {
    Dialog
  },
  mixins: [tables],
  props: {
    budgetLevelId: {
      type: String,
      default: ''
    }
  },
  data() {
    const justFloat = (rule, value, callback) => {
      if (!validateJustFloat(value)) {
        callback(new Error('请输入正确的单价'))
      } else {
        callback()
      }
    }
    return {
      categoryList: [],
      supplierList: [],
      select: {
        budgetLevelId: this.budgetLevelId,
        type: '',
        name: '',
        isUseable: ''
      },
      dataList: [],
      purchaseForm: {
        id: '',
        name: '',
        propertyType: '',
        modelNumber: '',
        singlePrice: '',
        budgetLevelId: this.budgetLevelId,
        supplierName: '',
        supplierTelephone: '',
        brandName: ''
      },
      purchaseFormCopy: {},
      purchaseRules: {
        singlePrice: [{ required: true, trigger: 'blur', validator: justFloat }],
        propertyType: [{ required: true, message: '请选择类别', trigger: 'change' }],
        name: [{ required: true, message: '请输入资产名称', trigger: ['blur', 'change'] }]
      }
    }
  },
  created() {
    this.select.budgetLevelId = this.budgetLevelId
    this.purchaseFormCopy = { ...this.purchaseForm }
    getDictList({ dictType: this.budgetLevelId }).then(({ data }) => {
      this.initSearchCriteria()
      this.categoryList = data.list
      this.fetchData()
    })
  },
  methods: {
    fetchData(clear) {
      const param = {
        limit: this.limit,
        page: clear ? this.page = 1 : this.page,
        ...this.select
      }
      getPurchaseInfoList(param).then(({ data }) => {
        this.dataList = data.list
        this.count = data.count
        this.dataList = this.dataList.map(item => {
          item.useableHtm = this.renderStateTag(item.useable ? '启用' : '停用')
          return item
        })
      })
    },
    modify(type, row) {
      this.getSupplier()
      if (type === 'edit') {
        this.$refs.dialog.setTitle('编辑')
        this.purchaseForm = JSON.parse(JSON.stringify(row))
        this.purchaseForm.budgetLevelId = row.budgetLevel.id
      } else {
        this.$refs.dialog.setTitle('新增')
        this.purchaseForm = { ...this.purchaseFormCopy }
      }
      this.$refs.dialog.show = true
    },
    editConfirm() {
      this.$refs.purchaseForm.validate(valid => {
        if (valid) {
          delete this.purchaseForm.propertyTypeName
          delete this.purchaseForm.budgetLevel
          delete this.purchaseForm.useableHtm
          addAndEditBudgetClass({ Loading: true, ...this.purchaseForm }).then(res => {
            this.fetchData()
            this.$message.success(res.msg)
            this.$refs.dialog.show = false
          })
        } else {
          return false
        }
      })
    },
    deletePurchase(id) {
      this.$confirm('是否删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePurchaseInfo({ id }).then(res => {
          this.$message.success(res.msg)
          this.fetchData()
        })
      })
    },
    modifyStatus(id, isUseable) {
      editPurchaseInfoStatus({ id, isUseable }).then(res => {
        this.$message.success(res.msg)
        this.fetchData()
      })
    },
    getSupplier() {
      getSupplierList({ supplierState: '1' }).then(({ data }) => {
        this.supplierList = data.list
      })
    },
    getsupplierName(row) {
      row ? this.purchaseForm.supplierTelephone = this.supplierList.filter(item => item.supplierName === row)[0].supplierTelephone : this.purchaseForm.supplierTelephone = ''
    }
  }
}
</script>

<style lang="scss">
.purchase {
  .purchase-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      width: calc(50% - 10px);
      .el-input.is-disabled .el-input__inner{
          background-color: #ffffff !important;
          color: #595d65;
      }
      .el-select {
        width: 100%;
      }
      &:last-child{
        width: 100%;
      }
    }
  }
  .dialog-footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>

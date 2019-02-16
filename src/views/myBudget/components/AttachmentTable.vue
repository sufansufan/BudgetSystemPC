<template>
  <div class="budget-attachment-table">
    <div class="budget-attachment-table-total-price">合计金额：￥
      <count-num :num="+totalPrice"/>
    </div>
    <el-table :data="createdData" style="width: 100%" header-row-class-name="table-head">
      <el-table-column type="index" label="序号"/>
      <el-table-column v-if="isAudit" prop="office.name" label="部门" width="180"/>
      <el-table-column label="类别" width="150">
        <template slot-scope="scope">
          <div>
            <el-select
              v-model="scope.row.categoryItem"
              :disabled="!isModify || scope.row.disabled"
              size="medium"
              placeholder="请选择"
              @change="categoryItemChange"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="150">
        <template slot-scope="scope">
          <div>
            <el-select
              v-model="scope.row.name"
              :disabled="!scope.row.categoryItem || !isModify || scope.row.disabled"
              size="medium"
              placeholder="请选择"
              @change="val => purchaseChange(val, scope.$index)"
              @focus="getPurchaseInfoList(scope.row.categoryItem)"
            >
              <el-option
                v-for="item in purchaseInfos"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品牌" min-width="150">
        <template slot-scope="scope">
          <div>
            <el-input
              v-model="scope.row.brandName"
              :disabled="!scope.row.name || !isModify || scope.row.disabled"
              size="medium"
              placeholder="请输入"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" width="150">
        <template slot-scope="scope">
          <div>
            <el-input
              v-model="scope.row.modelNumber"
              :disabled="!scope.row.name || !isModify || scope.row.disabled"
              size="medium"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="预算单价" width="150">
        <template slot-scope="scope">
          <div>
            <el-input
              v-model="scope.row.singlePrice"
              :disabled="!scope.row.name || !isModify || scope.row.disabled"
              type="number"
              size="medium"
              @mousewheel.prevent.native
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="110">
        <template slot-scope="scope">
          <div>
            <el-input-number
              v-model="scope.row.number"
              :min="1"
              :disabled="!scope.row.name || !isModify || scope.row.disabled"
              controls-position="right"
              size="medium"
              placeholder="请选择"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="预算金额" width="180">
        <template slot-scope="scope">
          <div>￥
            <count-num :num="+scope.row.applyAmount"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="使用人" width="100">
        <template slot-scope="scope">
          <div>
            <el-input
              v-model="scope.row.usedBy"
              :disabled="!scope.row.name || !isModify || scope.row.disabled"
              size="medium"
              placeholder="请输入"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请原因" width="200">
        <template slot-scope="scope">
          <div>
            <el-input
              v-model="scope.row.applyReason"
              :disabled="!scope.row.name || !isModify || scope.row.disabled"
              size="medium"
              placeholder="请输入"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="150">
        <template slot-scope="scope">
          <div>
            <el-input
              v-model="scope.row.supplierName"
              :disabled="!scope.row.name || !isModify || scope.row.disabled"
              size="medium"
              placeholder="请输入"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="供应商电话" min-width="150">
        <template slot-scope="scope">
          <div>
            <el-input
              v-model="scope.row.supplierTelephone"
              :disabled="!scope.row.name || !isModify || scope.row.disabled"
              size="medium"
              placeholder="请输入"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="isAudit || !isModify" label="后勤意见" width="150" fixed="right">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.advice"
            :disabled="!isModify || scope.row.disabled"
            size="medium"
            placeholder="请选择"
            @change="scope.row.disabled = false"
          >
            <el-option
              v-for="(item, index) in logisticalAdvice"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="200">
        <template slot-scope="scope">
          <div>
            <el-input
              v-model="scope.row.remarks"
              :disabled="!scope.row.name || !isModify || scope.row.disabled"
              size="medium"
              placeholder="请输入"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <div title="删除">
            <slot :row="{id: scope.row.id, isEdit: scope.row.advice ? false : true}">
              <el-button
                :disabled="!scope.row.name || !isModify || scope.row.disabled"
                icon="el-icon-delete"
                size="mini"
                circle
                @click="deleteRow(scope.$index)"
              />
            </slot>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPurchaseInfoList } from '@/api/approvalSettings'
import { getDictList } from '@/api'
import CountNum from '@/components/Plugins/CountNum'
export default {
  components: {
    CountNum
  },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    isAudit: {
      type: Boolean,
      default: false
    },
    levelAttachs: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      purchaseInfos: [],
      categoryList: [],
      initialData: {
        budgetLevel: {
          id: '', // 预算层次表id
          name: '', // 预算名称从预算层次表获取
          parent: {
            id: '' // 父级id
          }
        },
        propertyType: '', // 资产类别，字典表定义
        name: '', // 资产名称
        modelNumber: '', // 规格型号
        singlePrice: 0, // 预算单价
        number: '', // 申请数量
        applyAmount: 0, // 预算金额,
        applyReason: '', // 申请原因
        usedBy: '', // 使用人
        remarks: '', // 备注
        brandName: '', // 品牌
        supplierName: '', // 供应商
        supplierTelephone: '' // 供应商电话
      },
      createdData: [],
      logisticalAdvice: ['后勤采购', '自行采购'] // 后勤审批意见
    }
  },
  computed: {
    ...mapGetters(['attachmentData']),
    isCreate() {
      return (!this.$route.params.id && this.isEdit)
    },
    isModify() {
      return (this.isCreate || !!this.$route.params.id && this.isEdit)
    },
    totalPrice() {
      return this.createdData.map(item => item.applyAmount).reduce((s, n) => (+s + +n), 0)
    }
  },
  watch: {
    createdData: {
      handler(o) {
        const { id, name, parent: { id: pid } } = this.levelAttachs
        o = o.map(item => {
          item.singlePrice && (item.applyAmount = item.singlePrice * item.number)
          item.budgetLevel.id = id
          item.budgetLevel.name = name
          item.budgetLevel.parent || (item.budgetLevel.parent = {})
          item.budgetLevel.parent.id = pid
          if (item.advice && item.disabled === undefined) item.disabled = true
          return item
        })
        const attachmentData = JSON.parse(JSON.stringify(this.attachmentData))
        attachmentData[pid] = o.filter(item => item.name)
        this.$store.dispatch('SetAttachmentData', attachmentData)
      },
      deep: true
    },
    'levelAttachs.purchaseApplies': {
      handler(o) {
        if (o && o.length) {
          this.createdData = o
        } else {
          this.createdData = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getcategoryList()
    if (this.isCreate || this.$route.params.id && this.isEdit) {
      this.getPurchaseInfoList()
      this.isAudit || this.createdData.push(JSON.parse(JSON.stringify(this.initialData)))
    }
  },
  methods: {
    getPurchaseInfoList(type) {
      getPurchaseInfoList({
        type,
        budgetLevelId: this.levelAttachs.id,
        isUseable: true
      }).then(res => {
        this.purchaseInfos = res.data.list
      })
    },
    getcategoryList() {
      getDictList({ dictType: this.levelAttachs.id }).then(({ data }) => {
        this.categoryList = data.list
      })
    },
    purchaseChange(val, index) {
      const selectedPurchase = this.purchaseInfos.find(item => item.name === val)
      const { modelNumber, propertyType, singlePrice, brandName, supplierName, supplierTelephone } = selectedPurchase
      this.createdData[index].modelNumber = modelNumber
      this.createdData[index].singlePrice = +singlePrice
      this.createdData[index].propertyType = propertyType
      this.createdData[index].brandName = brandName
      this.createdData[index].supplierName = supplierName
      this.createdData[index].supplierTelephone = supplierTelephone
      this.createdData[index].number = 1
      if (!this.createdData[index + 1] && !this.isAudit) {
        this.createdData.push(JSON.parse(JSON.stringify(this.initialData)))
      }
    },
    categoryItemChange(val) {
      this.getPurchaseInfoList(val)
    },
    deleteRow(index) {
      this.createdData.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.budget-attachment-table {
  .el-icon-delete {
    font-size: 20px !important;
  }
  .table-head th {
    height: 58px;
    color: #444;
    font-size: 14px;
    background-color: #f8f8f8 !important;
  }
}
</style>

<style lang="scss" scoped>
.budget-attachment-table {
  &-total-price {
    text-align: right;
    margin-bottom: 10px;
    font-size: 14px;
  }
}
</style>

<template>
  <div
    :style="{minHeight: `calc(100vh - ${fastNav ? '162px' : '106px'})`}"
    class="budget-out-detail"
  >
    <div class="budget-out-detail-left">
      <div class="box-shadow">
        <div class="budget-out-detail-left-title">
          <div>
            <p>
              <b>{{ userInfo.office.name }}</b>
            </p>
            <p>{{ userInfo.name }}</p>
          </div>
          <h2>预算外申请</h2>
        </div>
        <div class="budget-out-detail-left-content">
          <el-form
            ref="budgetOutApply"
            :model="budgetOutApply"
            :rules="rules"
            label-width="100px"
            label-position="top"
            size="medium"
          >
            <el-form-item label="申请事由" prop="applyReason">
              <el-input :disabled="!isEdit" v-model="budgetOutApply.applyReason"/>
            </el-form-item>
            <el-form-item label="申请金额" prop="applyAmount" class="price-upper">
              <el-input
                :disabled="!isEdit"
                v-model="budgetOutApply.applyAmount"
                @change="number2CHN"
              />
              <span class="CHN">
                大写：
                <b>{{ CHN }}</b>
              </span>
            </el-form-item>
            <el-form-item label="用途类别" prop="budgetLevelId">
              <el-cascader
                v-model="budgetOutApply.budgetLevelId"
                :disabled="!isEdit"
                :options="constant.project"
                :props="{value: 'id', label: 'name', children: 'budgetLevels'}"
                placeholder="请选择用途类别"
                filterable
              />
            </el-form-item>
            <el-form-item label="用途明细">
              <el-input
                :rows="8"
                :disabled="!isEdit"
                v-model="budgetOutApply.richText"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item>
              <div class="budget-out-detail-left-content-btns">
                <el-button size="big" @click="$router.go(-1)">返回</el-button>
                <slot>
                  <template v-if="isEdit">
                    <el-button type="primary" size="big" @click="saveBudgetOut()">保存</el-button>
                    <template v-if="whetherSubmit || isCreate">
                      <el-button type="primary" size="big" @click="saveBudgetOut('submit')">保存并提交</el-button>
                    </template>
                  </template>
                </slot>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <budget-history v-if="$route.params.id" :history-list="history" class="box-shadow"/>
    </div>
    <div class="budget-out-detail-right">
      <el-form ref="budgetOutDetails" :model="budgetOutDetails" :rules="rules" size="medium">
        <el-form-item label="需要打款">
          <el-switch :disabled="!isEdit" v-model="budgetOutDetails.whetherRemit"/>
          <div v-show="budgetOutDetails.whetherRemit" class="budget-out-detail-right-content">
            <el-input :disabled="!isEdit" v-model="budgetOutDetails.payee" placeholder="请输入内容">
              <template slot="prepend">收款单位</template>
            </el-input>
            <el-input :disabled="!isEdit" v-model="budgetOutDetails.bankName" placeholder="请输入内容">
              <template slot="prepend">开户银行</template>
            </el-input>
            <el-input :disabled="!isEdit" v-model="budgetOutDetails.bankNo" placeholder="请输入内容">
              <template slot="prepend">银行账号</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="签订合同">
          <el-switch :disabled="!isEdit" v-model="budgetOutDetails.whetherContract"/>
          <div v-show="budgetOutDetails.whetherContract" class="budget-out-detail-right-content">
            <div class="inline">
              <el-input
                :disabled="!isEdit"
                v-model="budgetOutDetails.contractNo"
                placeholder="请输入内容"
              >
                <template slot="prepend">合同编号</template>
              </el-input>
              <el-input
                :disabled="!isEdit"
                v-model="budgetOutDetails.contractPrice"
                placeholder="请输入内容"
              >
                <template slot="prepend">合同总价款</template>
              </el-input>
            </div>
            <div class="inline">
              <el-input
                :disabled="!isEdit"
                v-model="budgetOutDetails.paymentEarly"
                placeholder="请输入内容"
              >
                <template slot="prepend">前期已付</template>
              </el-input>
              <el-input
                :disabled="!isEdit"
                v-model="budgetOutDetails.paymentEarlyRate"
                placeholder="请输入内容"
              >
                <template slot="prepend">支付比例</template>
                <template slot="append">%</template>
              </el-input>
            </div>
            <div class="inline">
              <el-input
                :disabled="!isEdit"
                v-model="budgetOutDetails.paymentApply"
                placeholder="请输入内容"
              >
                <template slot="prepend">本次申请</template>
              </el-input>
              <el-input
                :disabled="!isEdit"
                v-model="budgetOutDetails.paymentApplyRate"
                placeholder="请输入内容"
              >
                <template slot="prepend">支付比例</template>
                <template slot="append">%</template>
              </el-input>
            </div>
            <el-input
              :disabled="!isEdit"
              v-model="budgetOutDetails.paymentSurplus"
              placeholder="请输入内容"
            >
              <template slot="prepend">剩余待付</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="收到发票">
          <el-switch :disabled="!isEdit" v-model="budgetOutDetails.whetherInvoice"/>
          <div v-show="budgetOutDetails.whetherInvoice" class="budget-out-detail-right-content">
            <el-radio-group :disabled="!isEdit" v-model="budgetOutDetails.whetherPaper">
              <el-radio-button :label="true">纸质发票</el-radio-button>
              <el-radio-button :label="false">电子发票</el-radio-button>
            </el-radio-group>
            <el-input :disabled="!isEdit" v-model="budgetOutDetails.invoiceNo" placeholder="请输入内容">
              <template slot="prepend">{{ budgetOutDetails.whetherPaper ? '纸质' : '电子' }}发票号码</template>
            </el-input>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BudgetHistory from '../components/BudgetHistory'
import { getBudgetOutDetails, addOrEditBudgetOut, budgetOutSubmit } from '@/api/myBudget'
import { number2CHN, id2Level } from '@/utils'
export default {
  components: {
    BudgetHistory
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isAudit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      CHN: '',
      isOverRender: false,
      whetherSubmit: true,
      budgetOutApply: {
        applyReason: '',
        applyAmount: '',
        budgetLevelId: [],
        richText: ''
      },
      budgetOutDetails: {
        whetherRemit: false, // 是否需要打款 -- true false
        payee: '', // 收款单位
        bankName: '', // 开户银行
        bankNo: '', // 银行账号
        whetherContract: false, // 是否签订合同 -- true false
        contractNo: '', // 合同编号
        contractPrice: '', // 合同总价款
        paymentEarly: '', // 前期已付
        paymentEarlyRate: '', // 前期已支付比例
        paymentApply: '', // 本次申请
        paymentApplyRate: '', // 本次申请比例
        paymentSurplus: '', // 剩余代付
        whetherInvoice: false, // 是否收到发票 -- true false
        whetherPaper: true, // 是否纸质发票 -- true false
        invoiceNo: '' // 电子发票号码
      },
      rules: {
        applyReason: [{ required: true, message: '请填写申请事由', trigger: 'blur' }],
        applyAmount: [
          { required: true, message: '请填写申请金额', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
                callback(new Error('请输入最多两位小数的阿拉伯数字'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        budgetLevelId: [{ required: true, message: '请选择用途类别', trigger: 'change' }]
      },
      history: []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'fastNav', 'constant']),
    isCreate() {
      const { id } = this.$route.params
      if (this.isEdit && id === '') {
        return true
      }
      return false
    }
  },
  watch: {
    budgetOutApply: {
      handler() {
        if (this.isAudit && this.isOverRender) {
          this.$emit('changed')
        }
      },
      deep: true
    },
    budgetOutDetails: {
      handler() {
        if (this.isAudit && this.isOverRender) {
          this.$emit('changed')
        }
      },
      deep: true
    }
  },
  created() {
    const { id, whetherSubmit } = this.$route.params
    if (id === undefined) {
      this.$router.go(-1)
      return
    }
    this.whetherSubmit = whetherSubmit
    this.$store.dispatch('GetConstant', 'project').then(() => {
      if (id !== '') {
        this.getBudgetOutInfo({ id })
      }
    })
  },
  methods: {
    number2CHN(val) {
      this.CHN = number2CHN(val)
    },
    getBudgetOutInfo(params) {
      getBudgetOutDetails(params).then(res => {
        const { myBudgetOutInfo } = res.data
        this.history = myBudgetOutInfo.operationStory
        for (const i in this.budgetOutApply) {
          this.budgetOutApply[i] = myBudgetOutInfo[i]
        }
        for (const i in this.budgetOutDetails) {
          this.budgetOutDetails[i] = myBudgetOutInfo[i]
        }
        this.budgetOutApply.budgetLevelId = id2Level(this.constant.project, myBudgetOutInfo.budgetLevel.id, 'budgetLevels')
        this.number2CHN(this.budgetOutApply.applyAmount)
        this.$nextTick(() => {
          this.isOverRender = true
        })
      })
    },
    saveBudgetOut(type) {
      return new Promise((resolve, reject) => {
        this.$refs.budgetOutApply.validate((valid) => {
          if (valid) {
            const { budgetLevelId } = this.budgetOutApply
            const params = {
              Loading: true,
              id: this.$route.params.id || '',
              ...this.budgetOutApply,
              ...this.budgetOutDetails,
              budgetLevelId: budgetLevelId.length ? budgetLevelId[budgetLevelId.length - 1] : ''
            }
            addOrEditBudgetOut(params).then(res => {
              const { id } = res.data
              if (type === 'submit' && id) {
                budgetOutSubmit({ Loading: true, id }).then(() => {
                  this.$message.success('保存并提交成功')
                  this.$router.go(-1)
                })
              } else if (!this.isAudit) {
                this.$message.success('保存成功')
                this.$router.go(-1)
              }
              resolve()
            })
          } else {
            reject()
            return false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.budget-out-detail {
  &-left {
    &-content {
      .el-form-item {
        margin-bottom: 15px;
        .el-form-item__label {
          line-height: 24px;
          width: 100%;
          padding: 0;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          &::before {
            vertical-align: sub;
          }
        }
        &.price-upper {
          .el-input {
            width: 217px;
          }
          .el-form-item__content {
            display: flex;
            align-items: center;
          }
          .CHN {
            padding-left: 10px;
            font-size: 18px;
            line-height: 24px;
            color: #444;
          }
        }
      }
    }
  }
  &-right {
    .el-form-item {
      .el-switch {
        height: 35px;
        line-height: 35px;
      }
      .el-form-item__content {
        line-height: inherit;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.budget-out-detail {
  display: flex;
  justify-content: space-between;
  background: #f3f5f7;
  align-items: flex-start;
  margin: -22px;
  &-left,
  &-right {
    background: #fff;
    width: calc(50% - 11px);
  }
  &-left {
    &-title {
      display: flex;
      align-items: center;
      justify-content: center;
      > div {
        padding-right: 5px;
        &:first-child {
          border-right: 1px solid #ccc;
          margin-right: 5px;
        }
        p {
          margin: 0;
          text-align: right;
          b {
            font-size: 20px;
          }
          button {
            padding: 0;
          }
        }
      }
      h2 {
        font-size: 30px;
        font-weight: 100;
      }
    }
    &-content {
      &-btns {
        display: flex;
        justify-content: center;
      }
    }
  }
  &-right {
    box-shadow: 0 0 20px 10px #ececec;
    border-radius: 5px;
    padding: 15px 20px;
    &-content {
      padding: 20px 10px 0;
      .inline {
        display: flex;
        > div:first-child {
          margin-right: 15px;
        }
      }
      > div:not(:last-child) {
        margin-bottom: 15px;
      }
    }
  }
  .box-shadow {
    padding: 15px 20px 25px;
    box-shadow: 0 0 20px 10px #ececec;
    border-radius: 5px;
  }
}
</style>

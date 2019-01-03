<template>
  <div
    :style="{minHeight: `calc(100vh - ${fastNav ? '162px' : '106px'})`}"
    class="payment-managment-detail"
  >
    <div class="payment-managment-detail-left">
      <div class="box-shadow">
        <div class="payment-managment-detail-left-title">
          <h2>付款申请</h2>
        </div>
        <div class="payment-managment-detail-left-content">
          <el-form
            ref="payApply"
            :model="payApply"
            :rules="rules"
            label-width="100px"
            label-position="top"
            size="medium"
          >
            <el-form-item label="备注说明" prop="remarks">
              <el-input
                :rows="8"
                :disabled="!isEdit"
                v-model="payApply.remarks"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item label="付款账户" prop="payAccountName" class="payment-account">
              <el-select
                v-model="payApply.payAccountName"
                :disabled="!isEdit"
                placeholder="请选择账户"
                @change="payAccountChange"
              >
                <el-option
                  v-for="item in accountList"
                  :key="item.accountId"
                  :label="item.accountName"
                  :value="item.accountName"
                />
              </el-select>
              <div>
                <label>付款账号</label>
                <el-input v-model="payApply.payAccountNumber" disabled/>
              </div>
            </el-form-item>
            <el-form-item label="收款账户" prop="openBankName">
              <el-input v-model="payApply.openBankName" :disabled="!isEdit" placeholder="请填写开户行名称"/>
            </el-form-item>
            <el-form-item label=" " class="no-bor" prop="bankNo">
              <el-input v-model="payApply.bankNo" :disabled="!isEdit" placeholder="请填写银行卡号"/>
            </el-form-item>
            <el-form-item label=" " class="no-bor" prop="payeeName">
              <el-input v-model="payApply.payeeName" :disabled="!isEdit" placeholder="请填写姓名"/>
            </el-form-item>
            <el-form-item>
              <div class="payment-managment-detail-left-content-btns">
                <el-button size="big" @click="$router.go(-1)">返回</el-button>
                <slot :id="payApply.payApplyId">
                  <template v-if="isEdit">
                    <el-button type="primary" size="big" @click="submitPayApply">提交</el-button>
                  </template>
                </slot>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="payment-managment-detail-right">
      <budget-history v-if="$route.params.id" :history-list="payApplyRecords" class="box-shadow"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BudgetHistory from '../../myBudget/components/BudgetHistory'
import { getPayApplyInfo, getAccountList, editPayApply } from '@/api/paymentManagement'
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
      payApply: {
        remarks: '',
        payAccountName: '',
        payAccountNumber: '',
        openBankName: '',
        bankNo: '',
        payeeName: ''
      },
      rules: {
        remarks: [{ required: true, message: '请填写申请事由', trigger: 'blur' }],
        payAccountName: [{ required: true, message: '请选择付款账户', trigger: 'change' }],
        openBankName: [{ required: true, message: '请填写开户行名称', trigger: 'blur' }],
        bankNo: [{ required: true, message: '请填写银行卡号', trigger: 'blur' }],
        payeeName: [{ required: true, message: '请填写姓名', trigger: 'blur' }]
      },
      payApplyRecords: [],
      accountList: []
    }
  },
  computed: {
    ...mapGetters(['fastNav']),
    isCreate() {
      const { id } = this.$route.params
      if (this.isEdit && id === '') {
        return true
      }
      return false
    }
  },
  watch: {
    payApply: {
      handler() {
        if (this.isOverRender) {
          this.$emit('changed')
        }
      },
      deep: true
    }
  },
  created() {
    const { id } = this.$route.params
    if (id === undefined) {
      this.$router.go(-1)
      return
    }
    if (id) this.fetchData({ id })
    this.getAccountList()
  },
  methods: {
    fetchData(params) {
      getPayApplyInfo(params).then(res => {
        const { payApply, payApplyRecords } = res.data
        this.payApply = payApply
        this.payApplyRecords = payApplyRecords
        this.$nextTick(() => {
          this.isOverRender = true
        })
      })
    },
    submitPayApply() {
      this.$refs.payApply.validate((valid) => {
        if (valid) {
          const params = {
            Loading: true,
            payApply: {
              ...this.payApply,
              id: this.$route.params.id || ''
            }
          }
          editPayApply(params).then(() => {
            this.$message.success('保存付款申请成功')
            this.$router.go(-1)
          })
        } else {
          return false
        }
      })
    },
    getAccountList() {
      getAccountList({
        accountState: 1, // 账户状态  //字典值获取
        accountName: '', // 户名
        accountNumber: '' // 账号
      }).then(res => {
        this.accountList = res.data.list
      })
    },
    payAccountChange(val) {
      const selectedItem = this.accountList.find(item => item.accountName === val)
      this.payApply.payAccountNumber = selectedItem ? selectedItem.accountNumber : ''
    }
  }
}
</script>

<style lang="scss">
.payment-managment-detail {
  &-left {
    &-content {
      .el-form-item {
        margin-bottom: 15px;
        &.payment-account {
          .el-form-item__content {
            display: flex;
            justify-content: space-between;
            > div {
              width: calc(50% - 10px);
              &:not(.el-form-item__error) {
                position: relative;
              }
              &:nth-child(2) {
                margin-left: 10px;
                label {
                  position: absolute;
                  top: -41px;
                  color: #5a5e66;
                }
              }
            }
          }
        }
        &.no-bor {
          margin-top: -10px;
          &:nth-last-child(2) {
            margin-bottom: 30px;
          }
          .el-form-item__label {
            border: 0;
            &::before {
              display: none;
            }
          }
        }
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
}
</style>
<style lang="scss" scoped>
.payment-managment-detail {
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
    > div:first-child {
      margin-top: 0;
    }
  }
  .box-shadow {
    padding: 15px 20px 25px;
    box-shadow: 0 0 20px 10px #ececec;
    border-radius: 5px;
  }
}
</style>

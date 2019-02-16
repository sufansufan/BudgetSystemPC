<template>
  <div class="print-box">
    <div v-for="(item, index) in printList" :key="index" class="print-box-list">
      <h3>预算外申请付款单</h3>
      <div class="print-box-list-head">
        <div>
          申请部门：
          <span>{{ item.officeName }}</span>
        </div>
        <div>申请日期： {{ item.createDateString }}</div>
        <div>审批编号： {{ item.approvalNo }}</div>
      </div>
      <div class="print-box-list-table">
        <div>
          <div>
            <span>收款单位</span>
            <b>{{ item.payee }}</b>
          </div>
          <div>
            <span>付款方式</span>
            <b>银行转账</b>
          </div>
        </div>
        <div>
          <div>
            <span>开户银行</span>
            <b>{{ item.bankName }}</b>
          </div>
          <div>
            <span>金额（小写）</span>
            <b>{{ item.applyAmount }}</b>
            <b/>
          </div>
        </div>
        <div>
          <div>
            <span>银行账号</span>
            <b>{{ item.bankNo }}</b>
          </div>
          <div>
            <span>金额（大写）</span>
            <b>{{ number2CHN(item.applyAmount) }}</b>
          </div>
        </div>
        <div class="two-line dotted">
          <div>
            <span>用途类别</span>
            <b>{{ item.budgetLevelName }}</b>
          </div>
        </div>
        <div class="two-line dotted">
          <div>
            <span>用途明细</span>
            <b>{{ item.richText }}</b>
          </div>
        </div>
        <div class="dotted remarks">
          <div>
            <span>附加内容</span>
            <b>是否签订合同： {{ item.whetherContract ? '是' : '否' }}</b>
            <b>合同编号： {{ item.contractNo }}</b>
            <b>合同总价款： ￥{{ item.contractPrice }}</b>
          </div>
        </div>
        <div class="dotted remarks">
          <div>
            <span>附加内容</span>
            <b>前期已付 ￥{{ item.paymentEarly }}</b>
            <b>支付比例 {{ item.paymentEarlyRate }} %</b>
            <b>本次申请 ￥{{ item.paymentApply }}</b>
            <b>支付比例 {{ item.paymentApplyRate }} %</b>
            <b>剩余待付 ￥{{ item.paymentSurplus }}</b>
          </div>
        </div>
        <div class="dotted bg">
          <div>
            <span>是否收到发票：{{ item.whetherInvoice ? '是' : '否' }}</span>
            <span>发票类型：{{ item.whetherPaper ? '纸质发票' : '电子发票' }}</span>
            <span>电子发票号码：{{ item.invoiceNo }}</span>
          </div>
        </div>
        <div class="bg">
          <div>
            <span
              v-for="(audit, index) in item.auditBys"
              :key="index"
            >{{ audit.roleName ? (audit.roleName + '：') : '' }}{{ audit.name }}</span>
            <span>出纳：</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { number2CHN } from '@/utils'
export default {
  props: {
    printList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    printList: {
      handler() {
        this.printList.forEach(item => {
          while (item.auditBys.length < 7) {
            item.auditBys.push({})
          }
        })
      },
      deep: true
    }
  },
  methods: {
    number2CHN(num) {
      return number2CHN(num)
    }
  }
}
</script>

<style lang="scss" scoped>
.print-box {
  position: absolute;
  z-index: -5000;
  font-family: "宋体";
  &-list {
    width: 770px;
    height: 522px;
    overflow: hidden;
    position: relative;
    &:not(:nth-child(2n)) {
      &::after {
        content: "请沿此线裁剪";
        font-size: 12px;
        background-color: #fff;
        position: absolute;
        bottom: 5px;
        left: 50%;
        padding: 0 10px;
        transform: translateX(-50%);
      }
      &::before {
        content: "";
        position: absolute;
        bottom: 10px;
        height: 0;
        width: 100%;
        border-bottom: 1px dashed #000;
      }
    }
    &:first-child,
    &:nth-child(3n) {
      margin-bottom: 90px;
    }
    &:nth-child(2n) {
      height: 502px;
      padding-top: 20px;
      &::after {
        content: "请沿此线裁剪";
        font-size: 12px;
        background-color: #fff;
        position: absolute;
        top: 0;
        left: 50%;
        padding: 0 10px;
        transform: translateX(-50%);
      }
      &::before {
        content: "";
        position: absolute;
        top: 5px;
        height: 0;
        width: 100%;
        border-top: 1px dashed #000;
      }
    }
    h3 {
      font-size: 18pt;
      text-align: center;
      margin: 10px 0;
      line-height: 26px;
    }
    &-head {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      padding-bottom: 3px;
      div:first-child {
        span {
          display: inline-block;
        }
      }
      div:last-child {
        span {
          min-width: 25px;
          display: inline-block;
        }
      }
    }
    &-table {
      margin: 0 auto;
      border: 2px solid #000;
      > div {
        display: flex;
        height: 37px;
        line-height: 37px;
        b {
          font-size: 14px;
          padding-left: 10px;
        }
        &:not(:last-child) {
          border-bottom: 1px solid #000;
        }
        &.dotted {
          border-bottom: 1px solid #000;
        }
        &.bg {
          background-color: #d9d9d9;
          &:last-child {
            height: auto;
          }
          div {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            position: relative;
            > span {
              font-size: 14px;
              width: 25%;
              padding-left: 10px;
              font-weight: bold;
              &:nth-child(5)::after {
                content: "";
                position: absolute;
                left: 0;
                top: 37px;
                width: 100%;
                height: 1px;
                background: #000;
              }
            }
          }
        }
        &:not(.bg) > div {
          flex: 1;
          display: flex;
          > span {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            background-color: #d9d9d9;
          }
          &:first-child {
            > span {
              width: 84px;
              border-right: 1px solid #000;
            }
          }
          &:last-child:not(:first-child) {
            > span {
              width: 100px;
              border-left: 1px solid #000;
              border-right: 1px solid #000;
            }
          }
        }
        &.remarks {
          b {
            font-weight: normal;
          }
        }
        &.two-line {
          height: 51px;
          line-height: 51px;
        }
      }
    }
  }
}
</style>

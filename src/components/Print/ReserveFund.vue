<template>
  <div class="print-box">
    <div v-for="(item, index) in printList" :key="index" class="print-box-list">
      <h3>备用金申请支付单</h3>
      <div class="print-box-list-head">
        <div>
          申请校区：
          <span>{{ item.officeName }}</span>
        </div>
        <div>申请日期： {{ item.applyDateString }}</div>
        <div>审批编号： {{ item.approvalNo }}</div>
      </div>
      <div class="print-box-list-table">
        <div>
          <div>
            <span>收款人</span>
            <b>{{ item.payeeName }}</b>
          </div>
          <div>
            <span>付款方式</span>
            <b>{{ item.paymentWay }}</b>
          </div>
        </div>
        <div>
          <div>
            <span>开户银行</span>
            <b>{{ item.bankName }}</b>
          </div>
          <div>
            <span>金额（小写）</span>
            <b>{{ item.reserveFundApply }}</b>
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
            <b>{{ number2CHN(item.reserveFundApply) }}</b>
          </div>
        </div>
        <div class="two-line dotted">
          <div>
            <span>用途明细</span>
            <b>{{ item.usageDetails }}</b>
          </div>
        </div>
        <div class="dotted remarks">
          <div>
            <span>备注</span>
            <b>本月预算金额：{{ item.budgetAmount }}</b>
            <b>上月结余：{{ item.previousBalance }}</b>
          </div>
        </div>
        <div class="dotted bg">
          <div>
            <span>公司负责人：{{ item.auditBys[3].name }}</span>
            <span>部门负责人：{{ item.auditBys[0].name }}</span>
            <span>申请人：{{ item.payeeName }}</span>
          </div>
        </div>
        <div class="bg">
          <div>
            <span>财务负责人：{{ item.auditBys[2].name }}</span>
            <span>出纳：</span>
            <span>审核会计：{{ item.auditBys[1].name }}</span>
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
    height: 388px;
    overflow: hidden;
    position: relative;
    &:not(:nth-child(3n)) {
      &::after {
        content: "请沿此线裁剪";
        font-size: 12px;
        background-color: #fff;
        position: absolute;
        bottom: 0px;
        left: 50%;
        padding: 0 10px;
        transform: translateX(-50%);
      }
      &::before {
        content: "";
        position: absolute;
        bottom: 5px;
        height: 0;
        width: 100%;
        border-bottom: 1px dashed #000;
      }
    }
    &:first-child,
    &:nth-child(4n) {
      height: 375px;
      h3 {
        margin: 0 0 15px;
        line-height: 26px;
      }
    }
    &:nth-child(3n) {
      height: 360px;
    }
    h3 {
      font-size: 18pt;
      text-align: center;
      line-height: 38px;
      margin: 10px 0 10px;
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
          height: 34px;
          line-height: 34px;
          div {
            display: flex;
            width: 100%;
            > span {
              font-size: 14px;
              width: 30%;
              padding-left: 10px;
              font-weight: bold;
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
            &:nth-child(2) {
              padding-right: 150px;
            }
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

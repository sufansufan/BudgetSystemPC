<template>
  <div class="executive-editor-right">
    <div class="drag-tips">
      <i class="el-icon-back"/> 拖拽我可以更加清晰查看视图哦~
    </div>
    <div class="executive-editor-title">
      <div>
        <p>
          <b>{{ detailContent.name }}</b>
        </p>
        <p>{{ detailContent.date }}</p>
      </div>
      <h2>预算及执行总览</h2>
    </div>
    <div class="executive-editor-total">
      <div class="executive-editor-total-title">
        <h3>费用科目合计 / 实际合计</h3>
        <count-num :num="totalApplyAmount" prefix="￥"/>
        <count-num :num="totalRealAmount" prefix="￥"/>
      </div>
      <div
        v-for="{budgetLevel: item, applyAmount, realAmount} in budgetList"
        :key="item.id"
        class="executive-editor-total-list"
      >
        <h4>{{ item.name }}</h4>
        <count-num :num="applyAmount" prefix="￥"/>
        <count-num :num="realAmount" prefix="￥"/>
      </div>
      <div class="executive-editor-total-price">
        <h2>总计</h2>
        <count-num :num="totalApplyAmount" prefix="￥"/>
        <count-num :num="totalRealAmount" prefix="￥"/>
      </div>
    </div>
    <template/>
    <div class="executive-editor-btns">
      <el-button type="primary" size="big" @click="saveBudget()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CountNum from '@/components/Plugins/CountNum'
import { saveBudget } from '@/api/myBudget'
export default {
  name: 'ExecutiveEditorBudgetOverview',
  components: {
    CountNum
  },
  props: {
    detailContent: {
      type: Object,
      default: () => { }
    },
    reserveFundApply: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    ...mapGetters(['budgetList', 'attachmentData']),
    totalRealAmount() {
      return this.budgetList.map(item => item.realAmount).reduce((s, n) => (+s + +n), 0)
    },
    totalApplyAmount() {
      return this.budgetList.map(item => item.applyAmount).reduce((s, n) => (+s + +n), 0)
    }
  },
  methods: {
    saveBudget() {
      const params = {
        Loading: true,
        budgetSummary: {
          id: this.detailContent.id, // 编辑传入该值
          budgetBelongDate: this.detailContent.dateTime,
          name: this.detailContent.name || '',
          budgets: this.budgetList,
          purchaseApplys: [].concat(...Object.values(this.attachmentData)),
          reserveFundApply: this.reserveFundApply
        }
      }
      saveBudget(params).then(() => {
        this.$message.success('预算执行编辑成功')
        this.$router.push({ name: 'ExecutiveEditor' })
      })
    }
  }
}
</script>

<style lang="scss">
@keyframes shake {
  50% {
    left: -5px;
  }
  100% {
    left: 0px;
  }
}
.executive-editor-right {
  .drag-tips {
    position: absolute;
    top: 10px;
    left: 0;
    margin-left: 10px;
    animation: shake 3s infinite;
    transform-origin: 50% 100%;
    font-size: 12px;
    color: #ddd;
  }
}
</style>
<style lang="scss" scoped>
.executive-editor {
  .audit-reason {
    color: #bf1d1d;
  }
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
        &:last-child {
          font-size: 12px;
          color: #989898;
        }
        b {
          font-size: 20px;
        }
        button {
          padding: 0;
        }
      }
    }
    h2 {
      width: 210px;
      font-size: 30px;
      font-weight: 100;
    }
  }
  &-total {
    h2 {
      width: 210px;
    }
    h3 {
      margin: 0;
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      margin-bottom: 10px;
      h4 {
        width: 210px;
      }
      > span {
        width: 30%;
        text-align: right;
      }
      &:last-child {
        border-top: 4px solid #ddd;
      }
      &:first-child {
        border-bottom: 4px solid #ddd;
      }
      &:nth-last-child(2) {
        border: 0;
        margin-bottom: 10px !important;
      }
    }
    &-list {
      h4 {
        margin: 0;
      }
      padding: 15px 10px 15px 20px !important;
      margin-bottom: 0 !important;
      border-bottom: 1px solid #eee;
    }
  }
  &-btns {
    display: flex;
    justify-content: center;
  }
}
</style>

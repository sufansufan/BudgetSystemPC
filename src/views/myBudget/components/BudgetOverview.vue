<template>
  <div class="budget-overview">
    <div class="drag-tips">
      <i class="el-icon-back"/> 拖拽我可以更加清晰查看视图哦~
    </div>
    <div class="budget-overview-title">
      <div>
        <p>
          <template v-if="isMerge">
            <el-input v-model="detailContent.name" placeholder="请输入预算名称"/>
          </template>
          <template v-else>
            <b>{{ detailContent.name }}</b>
          </template>
        </p>
        <p>
          <el-date-picker
            v-model="dateMonth"
            :clearable="false"
            :editable="false"
            :disabled="!isEdit"
            type="month"
            placeholder="选择月"
          />
        </p>
      </div>
      <h2>预算总览</h2>
    </div>
    <div class="budget-overview-total">
      <div class="budget-overview-total-title">
        <h3>费用科目合计</h3>
        <count-num :num="+totalAmount" prefix="￥"/>
      </div>
      <div
        v-for="{budgetLevel: item, applyAmount} in budgetList"
        :key="item.id"
        class="budget-overview-total-list"
      >
        <h4>{{ item.name }}</h4>
        <count-num :num="+applyAmount" prefix="￥"/>
      </div>
      <div class="budget-overview-total-price">
        <h2>总计</h2>
        <count-num :num="+totalAmount" :size="24" prefix="￥"/>
      </div>
    </div>
    <template v-if="detailContent.reason">
      <h3 class="audit-reason">审核不通过：{{ detailContent.reason }}</h3>
    </template>
    <div class="budget-overview-btns">
      <template v-if="detailContent.isMergerSummary">
        <el-button type="primary" size="big" @click="showCharts">预算图表</el-button>
      </template>
      <slot v-if="isEdit || isMerge || isAudit">
        <el-button size="big" @click="saveBudget(1)">保存</el-button>
        <el-button type="primary" size="big" @click="saveBudget(2)">保存并提交</el-button>
      </slot>
    </div>
    <Dialog ref="dialog" title="平行线集团预算">
      <tree-map-charts :chart-data="chartData" :date="detailContent.date"/>
    </Dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CountNum from '@/components/Plugins/CountNum'
import { parseTime } from '@/utils'
import { saveBudget } from '@/api/myBudget'
import { getBudgetByIdChart } from '@/api/budgetApproval'
import Dialog from '@/components/Plugins/Dialog'
import TreeMapCharts from './TreeMapCharts'

export default {
  components: {
    CountNum,
    Dialog,
    TreeMapCharts
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
    isMerge: {
      type: Boolean,
      default: false
    },
    detailContent: {
      type: Object,
      default: () => { }
    },
    reserveFundApply: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      dateMonth: null,
      oldReserveFundApply: null,
      chartData: []
    }
  },
  computed: {
    ...mapGetters(['budgetList', 'attachmentData']),
    totalAmount() {
      return this.budgetList.map(item => item.applyAmount).reduce((s, n) => (+s + +n), 0)
    }
  },
  watch: {
    detailContent: {
      handler() {
        this.dateMonth = this.getNextMonth(this.detailContent.date)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    showCharts() {
      this.$refs.dialog.show = true
      const { id } = this.$route.params
      if (this.chartData.length) return
      getBudgetByIdChart({ id }).then(res => {
        this.chartData = res.data.list
      })
    },
    getNextMonth(date = null) {
      let [year, month] = parseTime(date ? new Date(date) : new Date(), 'y-m').split('-')
      if (!date) {
        month = +month + 1
        if (month > 12) {
          month = 1
          year = +year + 1
        }
      }
      return new Date(year + '-' + month)
    },
    saveBudget(type) {
      if (this.isMerge && !this.detailContent.name) {
        this.$message.error('请填写预算名称')
        return
      }
      let hasFundApply = true
      for (const i in this.reserveFundApply) {
        if (this.reserveFundApply[i] === '') {
          this.$message.error('请输入备用金')
          hasFundApply = false
          continue
        }
      }
      if (!hasFundApply) return
      // type 1为保存操作，2为提交保存操作
      const params = {
        Loading: true,
        budgetSummary: {
          id: this.detailContent.id, // 编辑传入该值
          state: type, // 1为保存操作，2为提交保存操作
          budgetBelongDate: this.dateMonth,
          name: this.detailContent.name || '',
          budgets: this.budgetList,
          purchaseApplys: [].concat(...Object.values(this.attachmentData)),
          reserveFundApply: this.reserveFundApply
        }
      }
      if (this.isMerge) {
        delete params.budgetSummary.id
        params.budgetSummary.isMergerSummary = true
        params.budgetSummary.officeIds = this.detailContent.officeIds
      }
      return saveBudget(params).then(() => {
        this.$message.success(type === 1 ? '预算保存成功' : '预算已保存，并提交成功')
        this.$route.params.rid || this.$router.go(-1)
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
.budget-overview {
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
  .el-date-editor--month {
    font-size: 12px;
    width: 75px !important;
    .el-icon-date {
      height: 18px !important;
      line-height: 18px;
      margin-top: -1px;
    }
    &.is-disabled .el-input__inner {
      background: transparent;
      color: #989898;
    }
    input {
      height: 18px !important;
      text-align: right;
      color: #989898;
      border: 0 !important;
      padding-right: 0 !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.budget-overview {
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
  &-total {
    h3 {
      margin: 0;
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      margin-bottom: 10px;
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

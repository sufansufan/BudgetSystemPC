<template>
  <div>
    <my-budgetDetail ref="detail" :is-edit="false" :is-merge="true" :merge-data="mergeData">
      <template slot-scope="row">
        <el-button type="primary" size="big" @click="showCharts">预算图表</el-button>
        <el-button type="primary" size="big" @click="saveChange">保存并提交</el-button>
      </template>
    </my-budgetDetail>
    <Dialog ref="dialog" title="平行线集团预算">
      <tree-map-charts :chart-data="chartData" :date="chartDate"/>
    </Dialog>
  </div>
</template>

<script>
import MyBudgetDetail from '../myBudget/components/Detail'
import { addBudgetSummaryMerge } from '@/api/budgetApproval'
import Dialog from '@/components/Plugins/Dialog'
import TreeMapCharts from '../myBudget/components/TreeMapCharts'
export default {
  name: 'BudgetSummaryMerge',
  components: {
    MyBudgetDetail,
    Dialog,
    TreeMapCharts
  },
  data() {
    return {
      mergeData: {},
      chartData: [],
      chartDate: ''
    }
  },
  created() {
    const ids = this.$route.params.id
    ids && this.fetchData(ids)
  },
  methods: {
    fetchData(ids) {
      addBudgetSummaryMerge({ ids }).then(res => {
        this.mergeData = res.data
      })
    },
    showCharts() {
      const { chartDate, budgetBelongDateString: date } = this.mergeData
      this.$refs.dialog.show = true
      this.$nextTick(() => {
        this.chartData = chartDate
        this.chartDate = date
      })
    },
    saveChange() {
      this.$refs.detail.$refs.budgetOverview.saveBudget(2)
    }
  }
}
</script>

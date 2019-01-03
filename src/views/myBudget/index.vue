<template>
  <div class="my-budget">
    <el-tabs v-model="activeName" :before-leave="tabBeforeClick">
      <el-tab-pane label="预算内" name="budgetary">
        <budgetary/>
      </el-tab-pane>
      <el-tab-pane label="预算外" name="extraBudgetary">
        <extra-budgetary/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Budgetary from './components/Budgetary'
import extraBudgetary from './components/extraBudgetary'
export default {
  components: {
    Budgetary,
    extraBudgetary
  },
  data() {
    return {
      activeName: 'budgetary'
    }
  },
  created() {
    const tabName = this.$route.query.tab
    this.activeName = this.openTab(tabName)
    this.$store.dispatch('GetConstant', ['office', 'budget_summary_state'])
  },
  methods: {
    tabBeforeClick(name) {
      this.$router.push({ query: { tab: name } })
    },
    openTab(tabName) {
      const tab = ['budgetary', 'extraBudgetary']
      if (!tabName) tabName = tab[0]
      if (!tab.includes(tabName)) {
        this.tabBeforeClick(tab[0])
        return tab[0]
      }
      return tabName
    }
  }
}
</script>

<template>
  <div>
    <budget-out-detail :is-edit="false"/>
  </div>
</template>

<script>
import BudgetOutDetail from '../components/BudgetOutDetail'
export default {
  components: {
    BudgetOutDetail
  }
}
</script>

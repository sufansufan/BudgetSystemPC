<template>
  <div>
    <budget-out-detail :is-edit="true"/>
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

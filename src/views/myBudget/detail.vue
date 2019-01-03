<template>
  <my-budgetDetail :is-edit="false"/>
</template>

<script>
import MyBudgetDetail from './components/Detail'
export default {
  name: 'MybudgetDetail',
  components: {
    MyBudgetDetail
  }
}
</script>

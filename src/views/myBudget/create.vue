<template>
  <my-budgetDetail :is-edit="true"/>
</template>

<script>
import MyBudgetDetail from './components/Detail'
export default {
  name: 'MybudgetCreate',
  components: {
    MyBudgetDetail
  }
}
</script>

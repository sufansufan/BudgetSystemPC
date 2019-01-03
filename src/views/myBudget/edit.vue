<template>
  <my-budgetDetail :is-edit="true"/>
</template>

<script>
import MyBudgetDetail from './components/Detail'
export default {
  name: 'MybudgetEdit',
  components: {
    MyBudgetDetail
  }
}
</script>

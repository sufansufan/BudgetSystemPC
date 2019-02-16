<template>
  <div class="insert-moulds">
    <el-dropdown @command="handleCommand">
      <el-button type="primary" size="mini" >
        插入模板<i class="el-icon-arrow-down el-icon--right"/>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="fund">专项资金</el-dropdown-item>
        <el-dropdown-item command="house">房屋预算</el-dropdown-item>
        <el-dropdown-item command="travel">差旅费用</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import fundMoule from '../fundMoule.js'
import travelMoule from '../travelMoule.js'
import houseMoule from '../houseMoule.js'
export default {
  methods: {
    handleCommand(command) {
      if (command === 'fund') {
        this.$emit('setContent', fundMoule)
      } else if (command === 'travel') {
        this.$emit('setContent', travelMoule)
      } else if (command === 'house') {
        this.$emit('setContent', houseMoule)
      }
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div class="payment-management">
    <el-tabs v-model="activeName">
      <el-tab-pane label="付款申请" name="apply">
        <apply/>
      </el-tab-pane>
      <el-tab-pane label="付款查询" name="query" lazy>
        <query/>
      </el-tab-pane>
      <el-tab-pane label="账户设置" name="settings" lazy>
        <settings/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Apply from './apply'
import Query from './query'
import Settings from './settings'
export default {
  components: {
    Apply,
    Query,
    Settings
  },
  data() {
    return {
      activeName: 'apply'
    }
  }
}
</script>

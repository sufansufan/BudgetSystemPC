<template>
  <div class="budget-history">
    <h2>操作历史</h2>
    <el-scrollbar>
      <ul>
        <li
          v-for="item in historyList"
          :key="item.id"
        >[{{ item.createDateString }}] {{ item.remarks }}</li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  props: {
    historyList: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.budget-history {
  margin-top: 22px;
  h2 {
    margin: 5px 0 18px;
    text-align: center;
  }
  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul {
    height: 500px;
  }
  li {
    font-size: 14px;
    line-height: 24px;
    color: #555;
    &:not(:last-child) {
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 5px;
      margin-bottom: 5px;
    }
  }
}
</style>

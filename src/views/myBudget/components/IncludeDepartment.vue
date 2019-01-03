<template>
  <div class="include-department">
    <h2>包含部门</h2>
    <el-scrollbar>
      <ul>
        <li v-for="(item, index) in departmentList" :key="index">{{ ++index }} {{ item.name }}</li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  props: {
    departmentList: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
.include-department {
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

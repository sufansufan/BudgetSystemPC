<template>
  <div class="dashboard-container"/>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['addRouters'])
  },
  created() {
    this.$router.push({ path: this.addRouters[0].path })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
<style lang="scss">
@keyframes progress-bar-stripes {
  from {
    background-position: 40px 0;
  }
  to {
    background-position: 0 0;
  }
}
.dashboard-container {
  .el-progress-bar__outer {
    box-shadow: 5px 5px 5px #e2e2e2 inset;
    > .el-progress-bar__inner {
      animation: reverse progress-bar-stripes 0.8s linear infinite,
        animate-positive 2s;
      background-image: linear-gradient(
        -45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
      );
      background-size: 40px 40px;
    }
  }
  .el-tabs__nav-wrap {
    .el-tabs__item {
      padding-right: 10px;
      color: #7d7d7d;
    }
    .el-tabs__active-bar {
      height: 4px;
      width: 26px !important;
      left: 18px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }
    .el-tabs__item.is-active {
      color: #000;
      font-size: 16px;
    }
    &::after {
      display: none;
    }
  }
}
</style>

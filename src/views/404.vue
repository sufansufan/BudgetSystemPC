<template>
  <div class="error-container">
    <div class="error-container-img">
      <svg-icon icon-class="404" style="font-size: 28em" />
    </div>
    <div class="error-container-content">
      <h1>404</h1>
      <div class="error-container-content-desc">{{ message }}</div>
      <div class="error-container-content-actions"><a href="/">
        <el-button type="primary">返回首页</el-button>
      </a></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  computed: {
    message() {
      return '抱歉，你访问的页面不存在'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
  &-img {
    padding-right: 100px;
  }
  &-content {
    h1 {
      color: #434e59;
      font-size: 70px;
      line-height: 70px;
      margin-bottom: 24px;
    }
    &-desc {
      color: rgba(0, 0, 0, 0.45);
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 16px;
    }
  }
}
</style>

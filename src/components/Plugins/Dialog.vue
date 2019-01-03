<template>
  <el-dialog
    :title="oTitle"
    :width="width"
    :top="top"
    :close-on-click-modal="false"
    :visible.sync="show"
    class="dialog"
    center
    @close="closed"
  >
    <slot/>
    <slot name="footer"/>
  </el-dialog>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '70%'
    },
    title: {
      type: String,
      default: '标题'
    },
    top: {
      type: String,
      default: '70px'
    }
  },
  data() {
    return {
      oTitle: '',
      show: false
    }
  },
  watch: {
    title: {
      handler() {
        this.oTitle = this.title
      },
      immediate: true
    }
  },
  methods: {
    setTitle(title) {
      this.oTitle = title
    },
    closed() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.dialog {
  .el-dialog__header {
    background: #f5f5f5;
    padding: 10px 0 9px !important;
    border-bottom: 1px solid #eee;
    .el-dialog__headerbtn {
      top: 15px;
    }
  }
}
</style>

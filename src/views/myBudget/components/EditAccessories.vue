<template>
  <div class="edit-assessories">
    <template v-if="isEdit">
      <tinymce ref="tinymce" v-model="content"/>
      <div class="edit-assessories-btns">
        <el-button type="primary" size="medium" @click="clear">清空</el-button>
        <el-button type="primary" size="medium" @click="saved">保存</el-button>
        <el-button size="medium" @click="$emit('close')">取消</el-button>
      </div>
    </template>
    <template v-else>
      <el-scrollbar>
        <div class="editor-content" v-html="content"/>
      </el-scrollbar>
    </template>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    Tinymce
  },
  props: {
    initData: {
      type: Object,
      default: () => { }
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      content: ''
    }
  },
  watch: {
    initData: {
      handler(o) {
        this.content = o.richText
        this.$refs.tinymce && this.$refs.tinymce.setContent(o.richText || '')
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    clear() {
      this.$emit('temp')
      this.$refs.tinymce.setContent('')
    },
    saved() {
      this.$emit('saved', this.content)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-assessories {
  &-btns {
    margin-top: 20px;
    text-align: center;
  }
  .editor-content {
    max-height: 550px;
  }
}
</style>

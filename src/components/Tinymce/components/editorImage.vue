<template>
  <div class="upload-container">
    <el-popover v-model="dialogVisible" placement="bottom" width="494" trigger="click">
      <div>
        <el-upload
          ref="uploadImg"
          :multiple="true"
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :auto-upload="false"
          accept="image/jpeg, image/png"
          class="editor-slide-upload"
          list-type="picture-card"
          action
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
      <el-button slot="reference" icon="el-icon-upload" size="mini" type="primary">上传图片</el-button>
    </el-popover>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {
    handleChange(file, fileList) {
      const fileName = file.uid
      this.listObj[fileName] = {}
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onloadend = () => {
        this.listObj[fileName] = { url: reader.result, hasSuccess: true, uid: file.uid, width: this.width, height: this.height }
      }
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>

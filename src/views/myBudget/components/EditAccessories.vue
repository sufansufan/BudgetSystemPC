<template>
  <div class="edit-assessories">
    <template v-if="isEdit">
      <tinymce ref="tinymce" v-model="content"/>
      <div class="edit-assessories-upload">
        <el-upload
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-remove="beforeRemove"
          :limit="3"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :file-list="fileList"
          :data="uploadData"
          action="/a/myBudget/uploadFile"
          multiple
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div class="edit-assessories-btns">
        <el-button type="primary" size="medium" @click="clear">清空</el-button>
        <el-button type="primary" size="medium" @click="saved">保存</el-button>
        <el-button size="medium" @click="close">取消</el-button>
      </div>
    </template>
    <template v-else>
      <el-scrollbar>
        <div class="editor-content" v-html="content"/>
        <div v-for="item in fileList" :key="item.id" class="file-list" @click="handlePreview(item)">
          {{ item.name }}
        </div>
      </el-scrollbar>
    </template>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { exportExcel } from '@/utils'
import { getToken } from '@/utils/auth'
import { deleteFile } from '@/api/myBudget'
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
    },
    fetUploadData: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      content: '',
      fileList: [],
      fileData: '',
      uploadData: {
        budgetSummaryId: '',
        budgetLevelId: '',
        token: ''
      },
      fileType: ['xls', 'xlsx', 'doc', 'docx', 'pdf']
    }
  },
  watch: {
    fetUploadData: {
      handler() {
        this.uploadData.budgetLevelId = this.fetUploadData.typeId
        this.fileList = this.fetUploadData.fileList
      },
      deep: true,
      immediate: true
    },
    initData: {
      handler(o) {
        this.content = o.richText
        this.$refs.tinymce && this.$refs.tinymce.setContent(o.richText || '')
        this.fileLists = undefined
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.uploadData.token = getToken()
    const { id } = this.$route.params
    this.uploadData.budgetSummaryId = id
  },
  methods: {
    clear() {
      this.$emit('temp')
      this.$refs.tinymce.setContent('')
    },
    saved() {
      this.$emit('saved', this.content, this.fileLists)
    },
    close() {
      this.$emit('close')
      this.$emit('temp')
    },
    beforeAvatarUpload(file) {
      const fileNameSplit = file.name.split('.')
      const fileStatus = this.fileType.includes(fileNameSplit[fileNameSplit.length - 1])
      if (!fileStatus) {
        this.$message({
          type: 'warning',
          message: '上传模板只能是 xls、xlsx、doc、docx、pdf 格式!'
        })
      }
      return fileStatus
    },
    handleRemove(file, fileList) {
      const { id } = file.response ? file.response.data : file
      if (id !== undefined) {
        deleteFile({ id }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
        })
        if (!fileList.length) {
          this.fileLists = []
        } else {
          this.getfileList(fileList)
        }
      }
    },
    handlePreview(file) {
      exportExcel(file, file.name, 'upload')
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handleSuccess(response, file, fileList) {
      this.fileData = response.data
      const list = JSON.parse(JSON.stringify(fileList))
      this.getfileList(list)
    },
    beforeRemove(file, fileList) {
      if (this.beforeAvatarUpload(file)) {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    getfileList(list) {
      this.fileLists = []
      list.map(item => {
        if (item.response) {
          this.fileLists.push({ name: item.name, url: item.response.data.filePath, id: item.response.data.id })
        } else {
          this.fileLists.push({ name: item.name, url: item.url, id: item.id })
        }
      })
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
  .file-list{
    cursor: pointer;
    background: #fcf6f6;
    margin-bottom: 10px;
  }
  .edit-assessories-upload {
    margin-top: 20px;
  }
}
</style>

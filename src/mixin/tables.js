import checkPermission from '@/utils/permission'
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      count: 0,
      pageSizes: [10, 30, 50, 100],
      resetSearchCriteria: {}
    }
  },
  mounted() {
    this.select && this.initSearchCriteria()
  },
  methods: {
    checkPermission,
    initSearchCriteria() {
      // 深拷贝默认搜索条件，以便重置搜索
      this.resetSearchCriteria = JSON.parse(JSON.stringify(this.select))
    },
    resetSearch() {
      // 重置搜索条件
      this.select = JSON.parse(JSON.stringify(this.resetSearchCriteria))
      if (this.$refs.multiCascader) {
        this.$refs.multiCascader.clearLabels()
      }
    },
    renderStateTag(state) {
      // 返回状态的Tag标签
      const stateList = {
        success: ['审核通过', '启用', '打款成功'],
        info: ['草稿', '申请中'],
        warning: ['待审核', '打款中'],
        danger: ['审核不通过', '停用', '打款失败', '不通过']
      }
      let tagType = 'el-tag--'
      for (const i in stateList) {
        if (stateList[i].includes(state)) {
          tagType += i
        }
      }
      return `<span class="el-tag ${tagType} el-tag--small">${state}</span>`
    },
    monthRangeBlur(vm, data) {
      // 月份多选插件光标处理
      let refs = []
      data
        ? (refs = ['startMonth' + data, 'endMonth' + data])
        : (refs = ['startMonth', 'endMonth'])
      const nextRef = refs.filter(item => item !== vm.name)
      vm.value && !this.$refs[nextRef].value && this.$refs[nextRef].focus()
    },
    handleSizeChange(val) {
      // 公共分页每页显示条数
      this.limit = val
      this.page = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      // 公共分页页码事件
      this.page = val
      this.fetchData()
    }
  }
}

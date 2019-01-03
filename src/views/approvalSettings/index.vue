<template>
  <div class="approval-containter">
    <el-tabs v-model="activeName">
      <el-tab-pane label="审批流设置" name="approvalFlow">
        <approval-flow/>
      </el-tab-pane>
      <el-tab-pane label="供应商设置" name="rererlevel">
        <supplier-set/>
      </el-tab-pane>
      <el-tab-pane v-for="item in tabList" :key="item.id" :label="item.name" :name="item.id">
        <purchase :budget-level-id="item.id"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ApprovalFlow from './components/ApprovalFlow'
import Purchase from './components/Purchase'
import SupplierSet from './components/SupplierSet'
import { getExamineTitleList } from '@/api/approvalSettings'
export default {
  name: 'ApprovalSet',
  components: {
    ApprovalFlow,
    Purchase,
    SupplierSet
  },
  data() {
    return {
      activeName: 'approvalFlow',
      tabList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getExamineTitleList().then(({ data }) => {
        this.tabList = data.list
      })
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <my-budgetDetail ref="detail" :is-edit="true" :is-audit="true" @changed="hasEdit = true">
    <template slot-scope="row">
      <el-button type="danger" size="big" @click="audit(false, row.auditId)">审批不通过</el-button>
      <el-button type="primary" size="big" @click="audit(true, row.auditId)">审批通过</el-button>
    </template>
  </my-budgetDetail>
</template>

<script>
import { editBudgetApproval } from '@/api/budgetApproval'
import MyBudgetDetail from '../myBudget/components/Detail'
export default {
  name: 'MybudgetAudit',
  components: {
    MyBudgetDetail
  },
  data() {
    return {
      auditAdvice: '',
      hasEdit: false
    }
  },
  methods: {
    isApproval(auditRes, auditId) {
      if (!auditRes) {
        this.$prompt('审批不通过意见', '审核意见2', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          closeOnClickModal: true,
          closeOnPressEscape: false,
          showClose: false,
          distinguishCancelAndClose: true,
          inputPattern: /\S/,
          inputErrorMessage: '请输入审核意见'
        }).then(({ value }) => {
          this.auditAdvice = value
          this.budgetApproval(auditRes, auditId)
        })
        return
      }
      this.budgetApproval(auditRes, auditId)
    },
    checkEditor(auditRes, auditId) {
      if (this.hasEdit) {
        this.$confirm('您对预算项目进行了编辑，是否先保存？', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          type: 'warning',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false
        }).then(() => {
          this.$refs.detail.$refs.budgetOverview.saveBudget('').then(() => {
            this.isApproval(auditRes, auditId)
          })
        }).catch(() => {
          this.isApproval(auditRes, auditId)
        })
        return
      }
      this.isApproval(auditRes, auditId)
    },
    audit(auditRes, auditId) {
      this.checkEditor(auditRes, auditId)
    },
    budgetApproval(auditRes, { id, rid }) {
      const params = {
        Loading: true,
        budgetApprovalId: rid,
        budgetSummaryId: id,
        approvalResult: auditRes,
        auditAdvice: this.auditAdvice
      }
      editBudgetApproval(params).then(res => {
        this.$message.success(res.msg)
        this.$router.push({ path: '/budgetapproval' })
      })
    }
  }
}
</script>

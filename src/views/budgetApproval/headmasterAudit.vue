<template>
  <my-budgetDetail :is-edit="false" :is-audit="true">
    <template slot-scope="row">
      <el-button type="danger" size="big" @click="audit(false, row.auditId)">审批不通过</el-button>
      <el-button type="primary" size="big" @click="audit(true, row.auditId)">审批通过</el-button>
    </template>
  </my-budgetDetail>
</template>

<script>
import { principalApproval } from '@/api/budgetApproval'
import MyBudgetDetail from '../myBudget/components/Detail'
export default {
  name: 'HeadmasterAudit',
  components: {
    MyBudgetDetail
  },
  data() {
    return {
      auditAdvice: ''
    }
  },
  methods: {
    audit(auditRes, auditId) {
      if (!auditRes) {
        this.$prompt('审批不通过意见', '审核意见', {
          confirmButtonText: '确定',
          showCancelButton: false,
          closeOnClickModal: false,
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
    budgetApproval(auditRes, { id }) {
      const params = {
        Loading: true,
        budgetSummaryId: id,
        approvalResult: auditRes,
        auditAdvice: this.auditAdvice
      }
      principalApproval(params).then(res => {
        this.$message.success(res.msg)
        this.$router.push({ path: '/BudgetApproval' })
      })
    }
  }
}
</script>

<template>
  <budget-out-detail ref="detail" :is-edit="true" :is-audit="true" @changed="hasEdit = true">
    <template>
      <el-button type="danger" size="big" @click="audit(false)">审批不通过</el-button>
      <el-button type="primary" size="big" @click="audit(true)">审批通过</el-button>
    </template>
  </budget-out-detail>
</template>

<script>
import { editBudgetOutByAudit } from '@/api/budgetApproval'
import BudgetOutDetail from '../myBudget/components/BudgetOutDetail'
export default {
  name: 'ExternaViewAudit',
  components: {
    BudgetOutDetail
  },
  data() {
    return {
      hasEdit: false,
      auditAdvice: ''
    }
  },
  methods: {
    audit(auditRes) {
      const { id } = this.$route.params
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
          this.hasSaveDetail(auditRes, id)
        })
        return
      }
      this.hasSaveDetail(auditRes, id)
    },
    hasSaveDetail(auditRes, id) {
      if (this.hasEdit) {
        this.$refs.detail.saveBudgetOut(1).then(() => {
          this.budgetApproval(auditRes, id)
        })
        return
      }
      this.budgetApproval(auditRes, id)
    },
    budgetApproval(auditRes, id) {
      const params = {
        Loading: true,
        id,
        whetherSuccess: auditRes,
        remark: this.auditAdvice
      }
      editBudgetOutByAudit(params).then(res => {
        this.$message.success(res.msg)
        this.$router.push({ path: '/BudgetApproval?tab=externaView' })
      })
    }
  }
}
</script>

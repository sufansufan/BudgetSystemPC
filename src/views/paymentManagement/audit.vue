<template>
  <detail :is-edit="false">
    <template slot-scope="row">
      <el-button type="danger" size="big" @click="audit(false, row.id)">不通过</el-button>
      <el-button type="primary" size="big" @click="audit(true, row.id)">通过</el-button>
    </template>
  </detail>
</template>

<script>
import Detail from './components/Detail'
import { makeMoney } from '@/api/paymentManagement'
export default {
  components: {
    Detail
  },
  methods: {
    audit(auditRes, id) {
      const params = {
        Loading: true,
        id,
        whetherPass: auditRes
      }
      makeMoney(params).then(res => {
        this.$message.success(res.msg)
        this.$router.go(-1)
      })
    }
  }
}
</script>

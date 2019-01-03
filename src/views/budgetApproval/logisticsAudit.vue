<template>
  <div class="logistics-audit">
    <div class="logistics-audit-btns">
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
      <el-button type="primary" size="medium" @click="saveAudit">保存并返回</el-button>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in listData" :key="item.id" :label="item.name" :name="item.id">
        <attachment-table :is-edit="true" :is-audit="true" :level-attachs="item">
          <template slot-scope="scope">
            <el-button
              :disabled="!scope.row.isEdit"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="delPurchaseApply(scope.row.id)"
            />
          </template>
        </attachment-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getLogisticsAuditInfo, editPurchaseApply, delPurchaseApply } from '@/api/budgetApproval'
import AttachmentTable from '../myBudget/components/AttachmentTable'
export default {
  name: 'LogisticsAudit',
  components: {
    AttachmentTable
  },
  data() {
    return {
      activeName: '',
      listData: []
    }
  },
  computed: {
    paramsId() {
      const ids = this.$route.params.id
      return ids
    }
  },
  created() {
    if (!this.$route.params.id) {
      this.$router.go(-1)
      return
    }
    this.fetchData()
  },
  methods: {
    fetchData() {
      getLogisticsAuditInfo({ ids: this.paramsId }).then(res => {
        this.listData = res.data.list
        if (!this.activeName || this.activeName === '0') this.activeName = this.listData[0].id
      })
    },
    saveAudit() {
      let purchaseApplys = this.listData.map(item => item.purchaseApplies.filter(item => item.disabled === false))
      purchaseApplys = [].concat(...purchaseApplys)
      if (!purchaseApplys.length) {
        this.$message.error('请选择后勤意见后再保存')
        return
      }
      editPurchaseApply({ Loading: true, purchaseApplys }).then(() => {
        this.$message.success('后勤审批成功')
        this.$router.go(-1)
      })
    },
    delPurchaseApply(ids) {
      this.$confirm('此操作将永久删除该申请, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPurchaseApply({ Loading: true, ids }).then(res => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => { })
    }
  }
}
</script>

<style lang="scss">
.logistics-audit {
  .el-tabs__header {
    width: calc(100% - 205px);
  }
}
</style>

<style lang="scss" scoped>
.logistics-audit {
  position: relative;
  &-btns {
    position: absolute;
    right: 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

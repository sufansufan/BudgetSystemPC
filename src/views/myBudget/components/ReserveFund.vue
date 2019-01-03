<template>
  <div class="reserve-fund">
    <h2>备用金申请</h2>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="12px">
      <el-form-item label=" " prop="reserveFundKeep">
        <el-input
          v-model="ruleForm.reserveFundKeep"
          :disabled="!isEdit"
          type="number"
          size="medium"
          placeholder="请输入备用金"
          @blur="fixPrice('reserveFundKeep')"
          @mousewheel.prevent.native
        >
          <template slot="prepend">备用金留存</template>
        </el-input>
      </el-form-item>
      <el-form-item label=" " prop="reserveFundApply">
        <el-input
          v-model="ruleForm.reserveFundApply"
          :disabled="!isEdit"
          type="number"
          size="medium"
          placeholder="请输入备用金"
          @blur="fixPrice('reserveFundApply')"
          @mousewheel.prevent.native
        >
          <template slot="prepend">备用金申请</template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    reserveFundData: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      ruleForm: {
        reserveFundKeep: '',
        reserveFundApply: ''
      },
      rules: {
        reserveFundKeep: [{ required: true, message: '请输入备用金', trigger: 'blur' }],
        reserveFundApply: [{ required: true, message: '请输入备用金', trigger: 'blur' }]
      }
    }
  },
  watch: {
    ruleForm: {
      handler(o) {
        this.$emit('update:reserveFundData', o)
        this.$emit('updateReserveFund')
      },
      deep: true
    },
    reserveFundData: {
      handler(o) {
        this.ruleForm = this.reserveFundData
      },
      deep: true
    }
  },
  methods: {
    fixPrice(item) {
      const price = this.ruleForm[item]
      this.ruleForm[item] = Number(price < 0 ? 0 : price).toFixed(2)
    }
  }
}
</script>

<style lang="scss">
.reserve-fund {
  .el-form-item__label {
    padding-top: 9px;
  }
  .el-form-item__error {
    left: 125px;
    margin-top: 2px;
  }
}
</style>

<style lang="scss" scoped>
.reserve-fund {
  margin-top: 22px;
  h2 {
    margin: 5px 0 18px;
    text-align: center;
  }
  .el-form-item {
    margin: 0;
    &:last-child {
      margin-top: 22px;
    }
  }
}
</style>

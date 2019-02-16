<template>
  <div class="user-modify">
    <el-form ref="userForm" :model="userForm" :rules="userRules" class="user-form">
      <el-form-item label="姓名" prop="name">
        <el-input v-model.trim="userForm.name" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="用户名" prop="loginName">
        <el-input v-model.trim="userForm.loginName" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model.trim="userForm.mobile" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="工号" prop="no">
        <el-input v-model.trim="userForm.no" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="部门归属/部门">
        <el-cascader
          :options="constant.office"
          :props="departmentType"
          v-model="selectDepart"
          change-on-select
          placeholder="部门"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="userForm.roleId" placeholder="角色">
          <el-option
            v-for="item in constant.role"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开户行名称">
        <el-input v-model.trim="userForm.bankName" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="银行卡号" prop="bankNo">
        <el-input v-model.trim="userForm.bankNo" placeholder="请输入"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="big" @click="$emit('close')">取 消</el-button>
      <el-button type="primary" size="big" @click="editConfirm">确 定</el-button>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addAndEditUser } from '@/api/user'
import { validatePhone, validateNumber } from '@/utils/validate'
export default {
  props: {
    editData: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    const phone = (rule, value, callback) => {
      if (!validatePhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const number = (rule, value, callback) => {
      if (rule.field === 'bankNo') {
        if (value) {
          if (!validateNumber(value)) {
            callback(new Error('请输入数字'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        if (!validateNumber(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }
    }
    return {
      departmentType: {
        value: 'id',
        label: 'name'
      },
      selectDepart: [],
      userForm: {
        id: '',
        name: '',
        loginName: '',
        mobile: '',
        no: '',
        officeId: '',
        roleId: '',
        bankName: '',
        bankNo: null,
        isUseable: ''
      },
      userRules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        loginName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        mobile: [{ required: true, validator: phone, trigger: 'blur' }],
        no: [{ required: true, validator: number, trigger: 'blur' }],
        bankNo: [{ validator: number, trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['constant'])
  },
  watch: {
    editData: {
      handler() {
        this.selectDepart = ['1']
        if (this.editData.id) {
          if (this.editData.office) {
            const { id: officeId } = this.editData.office
            if (this.editData.office) {
              if (this.editData.office.parent) {
                const { parent: { id: parentId } } = this.editData.office
                this.selectDepart.push('1', parentId, officeId)
                if (parentId === '1') {
                  this.selectDepart.push(parentId, officeId)
                }
              } else if (officeId === '1') {
                this.selectDepart = [officeId]
              }
            }
          }
          const { id, name, loginName, mobile, no, office, role: { id: roleId }, bankName, bankNo, isUseable } = this.editData
          this.userForm = {
            id,
            name,
            loginName,
            mobile,
            no,
            officeId: office && office.id,
            roleId,
            bankName,
            bankNo,
            isUseable
          }
        } else {
          this.userForm = {
            id: '',
            name: '',
            loginName: '',
            mobile: '',
            no: '',
            officeId: '',
            roleId: '',
            bankName: '',
            bankNo: '',
            isUseable: ''
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.$store.dispatch('GetConstant', ['office', 'role'])
  },
  methods: {
    editConfirm() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.userForm.officeId = this.selectDepart[this.selectDepart.length - 1]
          addAndEditUser({ Loading: true, ...this.userForm }).then(res => {
            this.$message.success(res.msg)
            this.$emit('close')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.user-modify {
  .user-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item {
      width: calc(50% - 10px);
      .el-select,
      .el-cascader {
        width: 100%;
      }
    }
  }
}
</style>

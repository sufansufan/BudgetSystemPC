<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 :class="{title: true, bcm: hasBCM}">
        <template v-if="hasBCM">
          <svg-icon icon-class="BCM"/>
          <b>银企直联</b>
        </template>
        <template v-else>预算系统</template>
      </h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" color="#d9b77c"/>
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          size="medium"
          auto-complete="on"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" color="#d9b77c"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          size="medium"
          auto-complete="on"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" color="#d9b77c"/>
        </span>
      </el-form-item>
      <el-form-item class="forget-pwd-btn">
        <el-button type="text" @click="showforgetPwd = true">忘记密码？</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >登 录</el-button>
      </el-form-item>
    </el-form>
    <div class="copyright">Copyright © 2018 平行线教育.版权所有</div>
    <div :class="{'forget-pwd': true, show: showforgetPwd}">
      <change-pwd @close="showforgetPwd = false"/>
      <el-button class="go-login" type="text" @click="forgetPwdClick">已有密码去登录</el-button>
    </div>
  </div>
</template>

<script>
import ChangePwd from '@/components/UserSettings/ChangePwd'
export default {
  name: 'Login',
  components: {
    ChangePwd
  },
  data() {
    const validateUser = (rule, value, callback) => {
      if (!value.trim().length) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5 || value.length > 20) {
        callback(new Error('请输入6-20位密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUser }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      showforgetPwd: false
    }
  },
  computed: {
    hasBCM() {
      return process.env.BCM === 1
    }
  },
  watch: {
    '$route': {
      handler(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      this.pwdType = this.pwdType === 'password' ? '' : 'password'
    },
    forgetPwdClick() {
      this.showforgetPwd = !this.showforgetPwd
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/' })
              this.$message.success('登录成功')
            })
            .catch(() => {
              this.$router.push({ path: this.redirect })
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #fff;
$light_color: #d9b77c;

/* reset element-ui css */
.login-container {
  .forget-pwd {
    .el-form-item__label {
      line-height: 40px;
    }
    input {
      border: 1px solid $light_color;
      border-radius: 30px;
      color: $light_color;
      &:hover {
        border-color: $light_color;
      }
    }
    .el-input-group__append {
      background: $light_color;
      border-radius: 0 30px 30px 0;
      border-color: transparent;
      color: #fff;
      .is-disabled {
        &:hover {
          background-color: transparent;
          border-color: transparent;
          border-radius: 0 30px 30px 0;
        }
      }
    }
  }
  > :not(.forget-pwd) {
    .el-input {
      display: inline-block;
      width: 85%;
      &:not(.is-disabled) .el-input__inner:not(:focus) {
        background-color: #fff !important;
      }
      input {
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: #444;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #444 !important;
        }
      }
    }
    .el-form-item:not(:nth-child(4)) {
      box-shadow: 0 0 10px #ccc;
      button {
        background: linear-gradient(to bottom right, #e4c384, #be9966);
        box-shadow: 0 0 10px #ccc;
        &:hover {
          background: linear-gradient(to top, #be9966, #e4c384);
        }
        &:active {
          background: linear-gradient(#be9966, #be9966);
        }
      }
    }
    .el-form-item__error {
      top: 50px;
      left: 50px;
    }
  }
  .copyright {
    position: absolute;
    bottom: 20px;
    right: 0;
    width: 584px;
    line-height: 24px;
    font-size: 12px;
    text-align: center;
    color: #999;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_color: #d9b77c;
.login-container {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    height: 100%;
    width: calc(100% - 584px);
    background: $bg url(../../assets/login_images/bg.png) no-repeat;
    background-size: cover;
  }
  .login-form {
    position: absolute;
    z-index: 2;
    top: 40%;
    right: 89px;
    transform: translateY(-50%);
    width: 405px;
    max-width: 100%;
    .el-form-item {
      border: 1px solid $light_color;
      border-radius: 30px;
      color: $light_color;
      margin-bottom: 32px;
      button {
        font-size: 16px;
        border-radius: 30px;
        border: 0px;
        height: 48px;
      }
      &:nth-child(3) {
        margin-bottom: 0;
      }
      &:last-child {
        border: 0;
      }
      &.forget-pwd-btn {
        border: 0;
        text-align: right;
        margin-bottom: 20px;
        background: transparent;
        button {
          background: transparent;
          color: $light_color;
        }
      }
    }
  }
  .forget-pwd {
    position: absolute;
    top: 50%;
    right: -385px;
    z-index: 3;
    width: 415px;
    height: 260px;
    margin-top: -200px;
    background: #fff;
    padding: 20px;
    opacity: 0;
    border-radius: 8px;
    transition: all 0.6s ease-in-out;
    &.show {
      right: 85px;
      opacity: 1;
    }
    .go-login {
      position: absolute;
      right: 20px;
      top: 232px;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 0 5px 4px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 42px;
    font-weight: 400;
    color: $light_color;
    margin: 0px auto 40px auto;
    text-align: center;
    &:not(.bcm) {
      text-shadow: 1px 1px #444;
    }
    &.bcm {
      .svg-icon {
        width: 200px;
        height: 60px;
      }
      b {
        display: block;
        font-size: 22px;
        font-weight: 400;
      }
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<template>
  <div class="user-settings">
    <h3>个人设置</h3>
    <div class="fast-nav">
      <h5>快捷导航</h5>
      <el-switch v-model="fastNavState" @change="toggleFastNav"/>
    </div>
    <el-collapse v-model="collapseNames" accordion>
      <el-collapse-item title="修改密码" name="pwd">
        <div class="change-pwd">
          <change-pwd/>
          <p v-if="!firstEnter">
            <el-alert :closable="false" title="请修改您的默认密码再进行其他操作！" type="error"/>
          </p>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChangePwd from './ChangePwd'
export default {
  components: {
    ChangePwd
  },
  data() {
    return {
      role: '1',
      collapseNames: 'pwd',
      fastNavState: true
    }
  },
  computed: {
    ...mapGetters(['fastNav', 'userInfo']),
    firstEnter() {
      return this.userInfo.whetherEditPassword
    }
  },
  created() {
    this.fastNavState = this.fastNav
  },
  methods: {
    toggleFastNav(state) {
      this.$store.dispatch('ToggleFastNav')
    }
  }
}
</script>

<style lang="scss">
.user-settings {
  padding: 22px;
  h5 {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .fast-nav {
    display: flex;
    height: 30px;
    justify-content: space-between;
    align-items: center;
    margin-top: 23px;
    h5 {
      margin: 0;
    }
  }
  .el-collapse {
    border: 0 !important;
    .el-collapse-item__header {
      font-weight: bold;
      font-size: 14px;
      color: #000;
      height: 30px;
      line-height: 30px;
      border: 0;
      i {
        line-height: 30px;
      }
    }
    .el-collapse-item__wrap {
      border: 0;
    }
    .el-collapse-item__content {
      padding: 10px 0;
    }
  }
  .change-theme {
    .el-scrollbar {
      height: calc(100vh - 215px);
    }
  }
  .el-radio-group {
    display: block !important;
    .el-radio-button {
      display: block;
      margin-bottom: 5px;
      &:focus:not(.is-focus):not(:active) {
        box-shadow: none;
      }
      .el-radio-button__inner {
        display: block;
        border: 1px solid #ddd;
        border-radius: 5px !important;
        padding: 5px;
        p {
          margin: 0;
          line-height: 16px;
          text-align: left;
        }
      }
      &.is-active {
        .el-radio-button__inner {
          border-color: transparent;
          box-shadow: none;
        }
      }
    }
  }
}
</style>

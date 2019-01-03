<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-avatar">
      <el-dropdown class="avatar-container" trigger="click" size="small" @command="handleCommand">
        <div class="avatar-wrapper">
          <p>
            {{ userInfo.name }}
            <el-tag type="primary" size="mini">{{ userInfo.role.name }}</el-tag>
          </p>
          <p>{{ userInfo.office.name }}</p>
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item command="userSettings">
            <svg-icon icon-class="setting"/>个人设置
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <svg-icon icon-class="logout"/>退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo'])
  },
  created() {
    if (!this.userInfo.whetherEditPassword) {
      this.$nextTick(() => {
        this.$store.dispatch('ToggleDrawer')
      })
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    handleCommand(command) {
      switch (command) {
        case 'userSettings':
          this.$store.dispatch('ToggleDrawer')
          break
        case 'logout':
          this.$store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
          break
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 84px;
  line-height: 84px;
  border-radius: 0px !important;
  border: 0 !important;
  .hamburger-container {
    height: 84px;
    float: left;
    padding: 5px 10px 0;
  }
  .breadcrumb-container {
    float: left;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .right-avatar {
    position: absolute;
    top: 19px;
    right: 34px;
    display: flex;
    height: 46px;
    align-items: center;
    p {
      margin: 0;
      line-height: 16px;
      font-size: 14px;
    }
    & > div {
      background: #ebeef1;
      height: 46px;
      margin-left: 10px;
      line-height: 46px;
      padding: 0 20px;
      border-radius: 25px;
      box-shadow: 0 0 8px #cacaca;
      &:last-child {
        p {
          &:first-child {
            padding-top: 6px;
            color: #000;
          }
          &:last-of-type {
            font-size: 12px;
            color: #848585;
            transform: scale(0.9);
            margin-left: -5px;
          }
        }
      }
    }
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    .avatar-wrapper {
      cursor: pointer;
      position: relative;
      padding-right: 8px;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -10px;
        top: 17px;
        font-size: 12px;
      }
    }
  }
}
</style>

<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="logo">
      <router-link to="/">
        <div>
          <img src="@/assets/def_images/logo.png">
        </div>
        <div>
          <p>预算系统</p>
          <p>Budget System</p>
        </div>
      </router-link>
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  > a {
    display: flex !important;
    height: 116px;
    justify-content: center;
    align-items: center;
    > div {
      &:first-child {
        width: 54px;
        height: 54px;
        min-width: 54px;
        min-height: 54px;
        border-radius: 50%;
        text-align: center;
        line-height: 70px;
        img {
          width: 48px;
        }
      }
      &:last-child {
        width: 140px;
        padding-left: 10px;
        border-radius: 50%;
        > p {
          margin: 0;
          padding-top: 5px;
          line-height: 14px;
          &:first-child {
            font-size: 16px;
            padding-left: 7px;
          }
          &:last-child {
            font-size: 12px;
            transform: scale(0.9);
          }
        }
      }
    }
  }
}
</style>

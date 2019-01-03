<template>
  <section :style="{minHeight: `calc(100vh - ${fastNav ? '162px' : '106px'})`}" class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    ...mapGetters(['fastNav', 'cachedViews']),
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  width: calc(100% - 44px);
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 20px 10px #ececec;
  position: relative;
  overflow: hidden;
  padding: 22px;
  margin: 0 auto 22px;
}
</style>

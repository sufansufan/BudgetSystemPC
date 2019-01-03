<template>
  <div v-show="fastNav" :style="{height: height + 'px'}" class="fast-nav-container">
    <div
      :style="{top:stickyTop+'px',zIndex:99,position:position,width:width,height:height+'px'}"
      class="tags-view-container"
    >
      <scroll-pane ref="scrollPane" class="tags-view-wrapper">
        <router-link
          v-for="tag in visitedViews"
          ref="tag"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          :key="tag.path"
          tag="span"
          class="tags-view-item"
          @click.middle.native="closeSelectedTag(tag)"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          <span class="text">{{ tag.title }}</span>
          <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
        </router-link>
      </scroll-pane>
      <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
        <li @click="refreshSelectedTag(selectedTag)">刷新</li>
        <li @click="closeSelectedTag(selectedTag)">关闭</li>
        <li @click="closeOthersTags">关闭其它</li>
        <li @click="closeAllTags">关闭所有</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScrollPane from '@/components/ScrollPane'
export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      active: false,
      stickyTop: 0,
      position: '',
      width: undefined,
      height: undefined,
      isSticky: false
    }
  },
  computed: {
    ...mapGetters(['fastNav']),
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
    this.height = this.$el.getBoundingClientRect().height || 34
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleReize)
  },
  activated() {
    this.handleScroll()
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleReize)
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path
    },
    addViewTags() {
      const { name } = this.$route
      this.filterNoTag()
      if (name) {
        this.$store.dispatch('addView', this.$route)
      }
      return false
    },
    filterNoTag() {
      this.visitedViews.forEach(item => {
        if (item.meta.noTag) {
          this.closeSelectedTag(item)
        }
      })
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag || []
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      this.top = e.clientY

      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },

    sticky() {
      if (this.active) {
        return
      }
      this.position = 'fixed'
      this.active = true
      this.width = this.width + 'px'
      this.isSticky = true
    },
    reset() {
      if (!this.active) {
        return
      }
      this.position = ''
      this.width = 'auto'
      this.active = false
      this.isSticky = false
    },
    handleScroll() {
      this.width = this.$el.getBoundingClientRect().width
      const offsetTop = this.$el.getBoundingClientRect().top
      if (offsetTop < this.stickyTop) {
        this.sticky()
        return
      }
      this.reset()
    },
    handleReize() {
      if (this.isSticky) {
        this.width = this.$el.getBoundingClientRect().width + 'px'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  padding-left: 6px;
  background: rgba(255, 255, 255, 1);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 16px;
      line-height: 16px;
      color: #495060;
      padding: 0 8px 0 16px;
      font-size: 12px;
      margin-top: 9px;
      &:last-of-type {
        margin-right: 15px;
      }
      & + span:not(.active) {
        border-left: 1px solid #ddd;
      }
      & > .text {
        position: relative;
        z-index: 2;
      }
      &.active {
        background-color: #f3f5f7;
        color: #444;
        border: 0;
        border-radius: 10px 10px 0 0;
        margin-top: 4px;
        margin-left: 0;
        height: 26px;
        line-height: 26px;
        box-shadow: 0 0 5px #ccc;
        & + span {
          border: 0;
        }
        &:first-child {
          margin-left: 5px;
        }
        &::before {
          content: "";
          background: #444;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
        &::after {
          content: "";
          background: #f3f5f7;
          position: absolute;
          bottom: -21px;
          left: -5px;
          height: 30px;
          width: calc(100% + 10px);
          border-radius: 50%;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.fast-nav-container {
  margin-bottom: 22px;
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 2px;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;
        &:before {
          transform: scale(0.6);
          display: inline-block;
          vertical-align: -3px;
        }
        &:hover {
          background-color: #b4bccc;
          color: #fff;
        }
      }
    }
  }
}
</style>

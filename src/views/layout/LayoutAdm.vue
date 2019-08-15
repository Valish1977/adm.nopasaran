<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar}">
    <div class="sidebar-container">
      <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
        <div class="scroll-wrapper" ref="scrollWrapper" :style="{top: top + 'px'}">
          <el-menu
            mode="vertical"
            :default-active="$route.path"
            :collapse="isCollapse"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
          >
            <div class="menu-wrapper">
              <template v-for="item in routes[0].children">
                <router-link
                  :to="item.path"
                  :key="item.name"
                >
                  <el-menu-item
                    :index="item.path"
                    :class="{'submenu-title-noDropdown':!isNest}"
                  >
                    <font-awesome-icon :icon="item.meta.icon"/>
                    <el-badge
                      style="position:absolute; top:-7px; right:7px"
                      v-if="item.meta.badge"
                      is-dot
                      class="item"
                    ></el-badge>

                    <span style="margin-left:15px">{{$t(item.meta.pageName)}}</span>
                  </el-menu-item>
                </router-link>
              </template>
            </div>
          </el-menu>
        </div>
      </div>
    </div>
    <div class="main-container">
      <el-menu class="navbar" mode="horizontal">
        <el-tooltip effect="dark" :content="$t('app.openCloseMenu')" placement="bottom">
          <span @click="toggleSideBar">
            <font-awesome-icon icon="bars" class="tooltip-btn left-btn"/>
            <span
              style="padding-left:20px; font-size:24px"
            >{{$t($store.getters.getCurrentRoute.meta.pageName)}}</span>
          </span>
        </el-tooltip>
        <div class="right-menu">
					<el-tooltip effect="dark" :content="$t('app.info')" placement="bottom">
            <span @click="infoDialog = true" style="font-size:10px" >
              <font-awesome-icon icon="info"  class="tooltip-btn right-btn"/>
            </span>
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('app.fullScreen')" placement="bottom">
            <span @click="fullScreenClick">
              <font-awesome-icon icon="expand-arrows-alt" class="tooltip-btn right-btn"/>
            </span>
          </el-tooltip>
          <el-tooltip effect="dark" :content="$t('app.exit')" placement="bottom">
            <span @click="logout">
              <font-awesome-icon icon="sign-out-alt" class="tooltip-btn right-btn"/>
            </span>
          </el-tooltip>
        </div>
      </el-menu>
      <section class="app-main" style="min-height: 100%">
        <el-col
          :span="24"
          v-loading="getLoading"
          :element-loading-text="$t('app.loadingModules')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        ></el-col>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </section>
    </div>
    <el-dialog :title="$t('info.title')" :visible.sync="infoDialog" width="500px" center>
      <p>{{$t('info.name')}}</p>
      <p>{{$t('info.version')}}{{$VERSION}}</p>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import screenfull, { Screenfull } from "screenfull";
import { mapGetters } from "vuex";
import Auth from "@/auth";
const auth = new Auth();
const delta = 15;
@Component({
  computed: {
    ...mapGetters("app", ["getLoading"])
  }
})
export default class LayoutAdm extends Vue {
  private getLoading!: any;
  private top: any = 0;
  private routes: any = []; // окно информации
  private sidebar: any = false;
  private isNest: any = false;
  private isFullscreen: any = false;
  private infoDialog: any = false;
  get isCollapse() {
    return !this.$store.getters.getSideBar;
  }
  private created(): any {
    this.sidebar = this.$store.getters.getSideBar;
    const RoleCode = this.$store.getters.getUser.RoleCode;
    this.routes = this.$store.getters.getRoutes(RoleCode);
  }
  private toggleSideBar(): any {
    this.sidebar = !this.sidebar;
    this.$store.dispatch("app/setSideBar", this.sidebar);
  }
  private logout(): any {
    auth.logOut();
  }
  private fullScreenClick(): any {
    if ( !( screenfull as Screenfull ).enabled ) {
      this.$message({
        message: this.$t("notice.brouserNotWork") as string,
        type: "warning"
      });
      return false;
    }
    ( screenfull as Screenfull ).toggle();
  }
  private handleScroll(e): any {
    const eventDelta = e.wheelDelta || -e.deltaY * 3;
    const $container: any = this.$refs.scrollContainer;
    const $containerHeight = $container.offsetHeight;
    const $wrapper: any = this.$refs.scrollWrapper;
    const $wrapperHeight = $wrapper.offsetHeight;
    if (eventDelta > 0) {
      this.top = Math.min(0, this.top + eventDelta);
    } else {
      if ($containerHeight - delta < $wrapperHeight) {
        if (this.top < -($wrapperHeight - $containerHeight + delta)) {
          this.top = this.top;
        } else {
          this.top = Math.max(
            this.top + eventDelta,
            $containerHeight - $wrapperHeight - delta
          );
        }
      } else {
        this.top = 0;
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "../../styles/variables.scss";

.app-wrapper {
  .el-badge__content.is-fixed {
    top: 100px !important;
  }
}
.scroll-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $menuBg;
  .scroll-wrapper {
    position: absolute;
    width: 100% !important;
  }
}
.tooltip-btn {
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
}
.right-btn {
  margin: 15px 15px 0 0;
}
.left-btn {
  margin: 15px 0 0 15px;
}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
  }
}
</style>


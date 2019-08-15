<template>
  <div id="app">
    <router-view></router-view>
    <transition name="fade">
      <div v-if="loadWindow > 0" id="hellopreloader_preload"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import bus from "@/bus";
import { Component } from "vue-property-decorator";

@Component({})
export default class App extends Vue {
  public loadWindow: number = 0;
  public hellopreloader: any;
  constructor() {
    super();
  }
  private created(): void {
    bus.$on("loadWindow", this.loadWindowFn); // вешаем на шину управление окном загрузки вкл/выкл */
  }
  private loadWindowFn(e: any): void {
    // управление окном загрузки вкл/выкл
    if (e.value) {
      this.loadWindow++;
    } else {
      const self = this;
      setTimeout(() => {
        // задержка позволит сохраняться стабильным окну загрузки
        this.loadWindow--;
        if (this.loadWindow < 0) {
          this.loadWindow = 0;
        }
      }, 500);
    }
    // tslint:disable-next-line
    //console.log(this.loadWindow, e);
  }
  private destroyed() {
    bus.$off("loadWindow", this.loadWindowFn);
  }
}
</script>

<style type="text/css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
#hellopreloader_preload {
  display: block;
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 100px;
  background: #2c3e50 url(https://nopasaran.su/theme/tail-spin.svg) center
    center no-repeat;
  background-size: 100px;
}
</style>
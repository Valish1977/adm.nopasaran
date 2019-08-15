<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <font-awesome-icon class="international-icon" icon="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="ru" :disabled="language==='ru'">Русский</el-dropdown-item>
      <el-dropdown-item command="eng" :disabled="language==='eng'">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script  lang="ts">
import i18n from "@/i18n";
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class LangSelect extends Vue {
  get language() {
    return this.$store.getters.language;
  }
  public handleSetLanguage(lang) {
    i18n.locale = lang;
    this.$store.dispatch("setLanguage", lang);
    localStorage.setItem("language", lang);
  }
}
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  padding-right: 2px;
}
</style>

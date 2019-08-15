import Vue from "vue";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import i18n from "@/i18n";
Vue.use(Element, {
    i18n: (key: any, value: any) => i18n.t(key, value),
    size: "small"
});

import Vue from "vue";
import Vuex from "vuex";
import VuexORM from "@vuex-orm/core";
import database from "./database";
import routes from "./modules/routes";
import auth from "./modules/auth";
import app from "./modules/app";
import lang from "./modules/lang";
import reference from "@/store/modules/reference";
import filters from "@/store/modules/filters";
import eventForm from "@/store/modules/eventForm";
import orgForm from "@/store/modules/orgForm";
import userForm from "@/store/modules/userForm";
import noticeForm from "@/store/modules/noticeForm";
Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  modules: {
    routes,
    auth,
    app,
    lang,
    reference,
    filters,
    eventForm,
    orgForm,
    userForm,
    noticeForm
  },
  plugins: [VuexORM.install(database)]
});

export default store;

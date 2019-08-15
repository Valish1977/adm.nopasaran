import "@babel/polyfill";
import Vue from "vue";
import "@/plugins/axios";
import App from "./App.vue";
import { router } from "@/router";
import store from "@/store";
import i18n from "@/i18n";
import "@/plugins/element";
import "./plugins/icons";
import Ref from "@/ref";
import Auth from "@/auth";

const ref = new Ref();
const auth = new Auth();
// false отключает предупреждение о работе в режиме разработки при запуске Vue
Vue.config.productionTip = (process.env.VUE_APP_DEV === 'true')? true : false;
Vue.config.devtools = (process.env.VUE_APP_DEV === 'true')? true : false;
Vue.prototype.$API_ROOT = process.env.VUE_APP_API_ROOT;
Vue.prototype.$VERSION = process.env.VUE_APP_VERSION;

// if no auth, user exist in local store?
if (!store.getters.getUser.auth) {
  // console.log("no user");
  // check user in localStorage
  if (!auth.checkUserInLocalStorage()) {
    router.push({ path: "/login" });
  }
}
// before each navigate to route
router.beforeEach((to: any, from: any, next: any) => {
  store.dispatch("app/setLoadingRoute", true); // добавляем окно загрузки
  setTimeout(() => {  // this delay is necessary for "loading.." window has time to appear
    // console.log("beforeEach",to.path, to.matched.length)
    // console.log(router)
    if (to.matched.length > 0) { // is route exist?
      switch ((to.path).toLowerCase()) { // route processing
        case "/login":
          return (store.getters.getUser.auth ? next("/") : next());
        default:
          return next();
      }
    } else {
      next("/404"); // if route isn"t exist go to /404
    }
  }, 500);
});
// eslint-disable-next-line
router.afterEach((to: any) => {
  store.dispatch("setCurrentRoute", to); // без этого не работает пагинация !!!
  store.dispatch("app/setLoadingRoute", false); // убираем окно загрузки
});
let isRefreshing: boolean;
Vue.$axios.interceptors.response.use(undefined, ( interceptorErr: any ) => {
  // Do something with response error
  // console.log("interceptors error");
  // console.log(interceptor_err.response);
  const mainResponce: any = interceptorErr.response;
  if ( mainResponce.status === 401 && !isRefreshing ) {
    isRefreshing = true;
    return new Promise((resolve, reject) => {
      Vue.$axios({
        headers: { Authorization: "none" },
        method: "post",
        url: "/api/rpc/refresh",
        data: {
          refresh_token: store.getters.getUser.refresh_token
        }
      })
        .then((refreshResponse: any) => {
          isRefreshing = false;
          // console.log("refreshResponse", refresh_response);
          const user: any = auth.makeUserFromResponse(refreshResponse);
          auth.setUser(user);
          ref.testVersions(refreshResponse.data[0].ref_version);
          mainResponce.config.headers = { Authorization: "Bearer " + user.auth_token };
          resolve(Vue.$axios(mainResponce.config));
        })
        .catch((err: any) => {
          isRefreshing = false;
          if (err.request.status === 403) {
            auth.logOut();
          }
          // console.log("Произошла ошибка в работе сервиса...", err);
          reject(err);
        });
    });
  } else {
    return Promise.reject( interceptorErr );
  }
});

window.onerror = function(message, source, line, column, error) {
  console.log('ONE ERROR HANDLER TO RULE THEM ALL:', message);
}

Vue.config.errorHandler = function(err, vm, info) {
  //oopsIDidItAgain();
  console.log(`Error: ${err.toString()}\nInfo: ${info}`);
}

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount("#app");

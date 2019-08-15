import Vue from "vue";
import Router from "vue-router";
import Error404 from "./views/Error404.vue";
import Login from "./views/Login.vue";
Vue.use(Router);
const createRouter = () => new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
    },
    {
      path: "/404",
      name: "error404",
      component: Error404,
      meta: { showToolbar: false, showDrawer: false, showAddItem: false, showInMenu: false }
    }
  ]
});
const router: any = createRouter();
const resetRouter = function resetRouterFn(): void {
  const newRouter: any = createRouter();
  router.matcher = newRouter.matcher; // the relevant part
};
export {router, resetRouter};

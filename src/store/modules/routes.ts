function loadComp(component: string) {
    return () => import(`@/views/${component}`);
}
const routes = {
    state: {
        currentRoute: {},
        routes: {
            adm: [
                {
                    path: "/adm", alias: "/", component: loadComp("layout/LayoutAdm"),
                    children: [
                        // tslint:disable-next-line:max-line-length
                        { path: "/adm/dashboard", name: "dashboard", component: loadComp("dashboard/DashboardAdm.vue"), meta: { pageName: "routes.dashboard", icon: "chart-bar", showAddItem: true, showInMenu: true } },
                        // tslint:disable-next-line:max-line-length
                        { path: "/adm/user", name: "user", component: loadComp("user/User.vue"), meta: { pageName: "routes.user", icon: "user", showAddItem: true, showInMenu: true } },
                        // tslint:disable-next-line:max-line-length
                        { path: "/adm/org", name: "org", component: loadComp("org/Org.vue"), meta: { pageName: "routes.org", icon: "user-friends", showAddItem: true, showInMenu: true } },
                        // tslint:disable-next-line:max-line-length
                        { path: "/adm/event", name: "event", component: loadComp("event/Event.vue"), meta: { pageName: "routes.event", icon: "id-badge", showAddItem: true, showInMenu: true } },
                        // tslint:disable-next-line:max-line-length
                        { path: "/adm/notice", name: "notice", component: loadComp("notice/Notice.vue"), meta: { pageName: "routes.notice", icon: "comment-dots", showAddItem: true, showInMenu: true } }
                    ]
                }
            ],
            cl: [
                {
                    path: "/cl", alias: "/", component: loadComp("layout/LayoutAdm"),
                    children: [
                        // tslint:disable-next-line:max-line-length
                        { path: "/cl/dashboard", name: "dashboard", component: loadComp("dashboard/DashboardCl.vue"), meta: { pageName: "routes.dashboard", icon: "chart-bar", showAddItem: true, showInMenu: true } },
                        // tslint:disable-next-line:max-line-length
                        { path: "/cl/event", name: "event", component: loadComp("event/EventCl.vue"), meta: { pageName: "routes.event", icon: "id-badge", showAddItem: true, showInMenu: true } }
                    ]
                }
            ]
        }
    },
    getters: {
        getRoutes: (state: any) => (RoleCode: string) => state.routes[RoleCode],
        getCurrentRoute: (state: any) => state.currentRoute
    },
    mutations: {
        SET_CURRENT_ROUTE: (state: any, currentRoute: any) => {
            state.currentRoute = currentRoute;
        }
    },
    actions: {
        setCurrentRoute({ commit }, currentRoute: any) {
            commit("SET_CURRENT_ROUTE", currentRoute);
        }
    }
};
export default routes;

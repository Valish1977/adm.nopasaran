import Vue from "vue";
const app = {
    namespaced: true,
    state: {
        sidebar: false,
        countLoad: 0,
        loadingRoute: false,
        pagination: {
            total: 0,
            page: 1,
            offset: 0,
            limit: 25,
            pageSize: [25, 50, 100]
        },
        excel: {
            created: false,
            data: {},
            key: "",
            group: "",
            settings: false
        }
    },
    mutations: {
        SET_DATA: (state: any, { type, items }) => {
            state[type] = items;
        },
        SET_LOAD: (state: any, value: boolean) => {
            if (value) {
                state.countLoad++;
            } else {
                state.countLoad--;
            }
        },
        SET_PAGINATION_DATA: (state: any, data: any) => {
            if (data.name === "pageSize") {
                Vue.set(state.pagination, "limit", data.data[0]);
            }
            if (data.name === "page") {
                Vue.set(state.pagination, "offset", data.data * state.pagination.limit - state.pagination.limit);
            }
            Vue.set(state.pagination, data.name, data.data);
        },
        SET_EXCEL_DATA: (state: any, data: any) => {
            if (data.name === "data") {
                if (data.params !== undefined) {
                    Vue.set(state.excel, "key", data.params.key);
                    Vue.set(state.excel, "group", data.params.group);
                    if (data.params.settings !== undefined) {
                        Vue.set(state.excel, "settings", data.params.settings);
                    }
                    if (data.params.created !== undefined) {
                        Vue.set(state.excel, "created", data.params.created);
                    }
                }
                Vue.set(state.excel, "data", data.data);
            } else {
                Vue.set(state.excel, data.name, data.data);
            }
        }
    },
    actions: {
        setPaginationData({ commit }, data: any) { // данные пагинации
            commit("SET_PAGINATION_DATA", { name: data.name, data: data.data });
        },
        setExcelData({ commit }, data: any) { // данные exel
            commit("SET_EXCEL_DATA", data);
        },
        setSideBar({ commit }, newData: any) { // изменяем значение сайдбара
            commit("SET_DATA", { type: "sidebar", items: newData });
        },
        setLoading({ commit }, data) { // изменяем значение сайдбара
            commit("SET_LOAD", data.value);
        },
        setLoadingRoute({ commit }, newData) { // изменяем значение сайдбара
            commit("SET_DATA", { type: "loadingRoute", items: newData });
        }
    },
    getters: {
        getExcelData: (state: any) => state.excel,
        getPaginationData: (state: any) => state.pagination,
        getSideBar: (state: any) => state.sidebar,
        getLoading: (state: any) => state.countLoad !== 0,
        getLoadingRoute: (state: any) => state.loadingRoute
    }
};

export default app;

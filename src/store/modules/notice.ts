import { getItems } from "@/api/notice";
export default {
    namespaced: true,
    actions: {
      CREATE_NOTICE: async (store, data) => {
        store.dispatch("app/setLoading", {name: "notice.ts/CREATE_NOTICE", value: true} , { root: true });
        const items = await getItems(data.filters);
        store.dispatch("create", { entity: "notice",  data: items });
        store.dispatch("app/setLoading", {name: "notice.ts/CREATE_NOTICE", value: false} , { root: true });
      }
    }
};

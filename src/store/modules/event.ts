import { getItems } from "@/api/event";
export default {
    namespaced: true,
    actions: {
      CREATE_EVENT: async (store, data) => {
        store.dispatch("app/setLoading", {name: "event.ts/CREATE_EVENT", value: true} , { root: true });
        const items = await getItems(data.filters);
        store.dispatch("create", { entity: "CREATE_EVENT",  data: items });
        store.dispatch("app/setLoading", {name: "event.ts/CREATE_EVENT", value: false} , { root: true });
      }
    }
};

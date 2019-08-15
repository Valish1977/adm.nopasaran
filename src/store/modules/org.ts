import { getItems } from "@/api/org";
export default {
    namespaced: true,
    actions: {
      CREATE_ORG: async (store, data) => {
        store.dispatch("app/setLoading", {name: "org.ts/CREATE_ORG", value: true} , { root: true });
        const items = await getItems(data.filters);
        store.dispatch("create", { entity: "org",  data: items });
        store.dispatch("app/setLoading", {name: "org.ts/CREATE_ORG", value: false} , { root: true });
      }
    }
  };

import { getItems } from "@/api/user";
export default {
  namespaced: true,
  actions: {
    CREATE_USER: async (store, data) => {
      store.dispatch("app/setLoading", {name: "user.ts/CREATE_USER", value: true} , { root: true });
      const items = await getItems(data.filters);
      store.dispatch("create", { entity: "user",  data: items });
      store.dispatch("app/setLoading", {name: "user.ts/CREATE_USER", value: false} , { root: true });
    }
  }
};

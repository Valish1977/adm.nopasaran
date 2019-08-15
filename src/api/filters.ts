// load DTO from server and transform to internal format
import Vue from "vue";
import store from "@/store/index";

export async function getPrefs() {
  const items = await Vue.$axios.get("/api/user?select=prefs&id=eq." + store.getters.getUser.id ).then(
    (response: any) => {
      if (response.status === 200) {
        return response.data[0].prefs;
      } else {
        return false;
      }
    },
    (err: any) => {
      // tslint:disable-next-line:no-console
      console.log(err);
      return false;
    }).catch((error: any) => {
    // tslint:disable-next-line:no-console
    console.log(error);
    return false;
  });
  return items;
}


export async function updatePrefs(prefs: any) {
  const prefsChanges = await Vue.$axios.post(
    "/api/rpc/update_prefs",
    {p : prefs}
  ).then(
    (response: any) => {
      if (response.status === 200) {
        return response.data;
      } else {
        return false;
      }
    },
    (err: any) => {
      // tslint:disable-next-line:no-console
      console.log(err);
      return false;
    }).catch((error: any) => {
    // tslint:disable-next-line:no-console
    console.log(error);
    return false;
  });
  return prefsChanges;
}

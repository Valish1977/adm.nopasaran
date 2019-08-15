// load DTO from server and transform to internal format
import Vue from "vue";
import store from "@/store/index";

export async function getItems(query) {
  const items: any = await Vue.$axios.get("/api/user" + query, { headers: { Prefer: "count=exact" } }).then(
    (response: any) => {
      if (response.status === 200 || response.status === 206) {
        const count: any = response.headers["content-range"].split("/");
        store.dispatch("app/setPaginationData", { name: "total", data: parseInt(count[1], 10) });
        return response.data;
      } else {
        return false;
      }
    },
    (err: any) => {
      // tslint:disable-next-line:no-console
      console.log(err);
    }).catch((error: any) => {
      // tslint:disable-next-line:no-console
      console.log(error);
      return false;
    });
  return items;
}

export function insertItem() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const data = store.getters["userForm/ITEMS"];
    const result: any = {};
    for (const i in data) {
      if (i !== "hash2" && i !== "id") {
        result[i] = data[i];
      }
    }
    Vue.$axios.post("/api/user",
      result,
      { headers: { Prefer: "return=representation" } }
    ).then(
      (response: any) => {
        if (response.status === 201) {
          resolve(response.data[0]);
        } else {
          reject("err insertItem: response.status - " + response.status);
        }
      },
      (err: any) => {
        reject(err);
      }
    ).catch((error: any) => {
      reject(error);
    });
  });
}

export function updateItem() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const data = store.getters["userForm/ITEMS"];
    const result: any = {};
    for (const i in data) {
      if (i !== "hash2" && i !== "hash" && i !== "id") {
        result[i] = data[i];
      }
    }
    Vue.$axios.patch("/api/user?id=eq." + store.state.userForm.id,
      result,
      { headers: { Prefer: "return=representation" } }
    )
      .then(
        (response: any) => {
          if (response.status === 200 && response.data.length > 0) {
            resolve(response.data);
          } else {
            reject("err updateItem: response.status - " + response.status);
          }
        },
        (err: any) => {
          reject(err);
        }).catch((error: any) => {
        reject(error);
      });
  });
}

export function updatePass() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const data = store.getters["userForm/ITEMS"];
    const result = {};
    for (const i in data) {
      if (i === "hash") {
        result[i] = data[i];
      }
    }
    Vue.$axios.patch("/api/user?id=eq." + store.state.userForm.id,
      result,
      { headers: { Prefer: "return=representation" } }
    )
      .then(
        (response: any) => {
          if (response.status === 200 && response.data.length > 0) {
            resolve(response.data);
          } else {
            reject("err updateItem: response.status - " + response.status);
          }
        },
        (err: any) => {
          reject(err);
        }).catch((error: any) => {
        reject(error);
      });
  });
}

export function deleteItem(id: number) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {

    Vue.$axios.patch("/api/user?id=eq." + id,
      { del: true },
      { headers: { Prefer: "return=representation" } }
    ).then(
      (response: any) => {
        if (response.status === 200 && response.data.length > 0) {
          resolve(true);
        } else {
          reject("err deleteItem: response.status - " + response.status);
        }
      },
      (err: any) => {
        reject(err);
      }
    ).catch((error: any) => {
      reject(error);
    });
  });
}


export function activate(val: boolean, id: number) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    Vue.$axios.patch("/api/user?id=eq." + id,
      {
        active: val
      },
      { headers: { Prefer: "return=representation" } }
    ).then(
      (response: any) => {
        if (response.status === 200 && response.data.length > 0) {
          resolve(true);
        } else {
          reject("err activate item: response.status - " + response.status);
        }
      },
      (err: any) => {
        reject(err);
      }).catch((error: any) => {
        reject(error);
      });
  });
}


export function searchDuplicateCard() {  // проверка на наличие дубликата записи
  return new Promise((resolve, reject) => {
    const changes: any = store.state.userForm.changes;
    const origin: any = store.state.userForm.origin;
    if (changes.login === undefined || changes.login === origin.login) {
      resolve([]);
      return;
    }

    let id = "";
    if (changes.id !== "" && changes.id !== null && changes.id !== undefined) {
      id = "id=neq." + changes.id + "&";
    }

    Vue.$axios.get("/api/user?" + id + "login=eq." + changes.login).then((response: any) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject("err searchDuplicateCard: response.status - " + response.status);
      }
    }, (err: any) => {
      reject(err);
    }).catch((error: any) => {
      reject(error);
    });
  });
}

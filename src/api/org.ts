// load DTO from server and transform to internal format
import Vue from "vue";
import store from "@/store/index";

export async function getItems(query: any) {
  const items: any = await Vue.$axios.get("/api/org" + query, { headers: { Prefer: "count=exact" } }).then(
    (response: any) => {
      if (response.status === 200 || response.status === 206) {
        const count = response.headers["content-range"].split("/");
        store.dispatch("app/setPaginationData", {name: "total", data: parseInt(count[1], 10)});
        return response.data;
      } else {
        return false;
      }
    },
    (err: any) => {
      console.log(err);
    }
  ).catch((error: any) => {
    console.log(error);
    return false;
  });
  return items;
}

export function insertItem() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const data = store.getters["orgForm/ITEMS"];
    Vue.$axios.post("/api/org",
      data,
      { headers: { Prefer: "return=representation" }}
    ).then(
      (response: any) => {
        if (response.status === 201) {
          resolve(response.data[0]);
        } else {
          reject("err insertItem: response.status - " + response.status );
        }
      },
      (err: any) => {
        reject( err );
      }
    ).catch((error: any) => {
      reject( error );
    });
  });
}
export function updateItem() {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const data = store.getters["orgForm/ITEMS"];
    Vue.$axios.patch("/api/org?id=eq." + store.state.orgForm.id,
      data,
      { headers: { Prefer: "return=representation" }}
    ).then(
        (response: any) => {
          if (response.status === 200 && response.data.length > 0) {
            resolve(response.data);
          } else {
            reject("err updateItem: response.status - " + response.status );
          }
        },
        (err: any) => {
          reject( err );
        }
      ).catch((error: any) => {
        reject( error );
      });
  });
}
export function activate(val: boolean, id: number) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    Vue.$axios.patch("/api/org?id=eq." + id,
      {
        active: val
      },
      { headers: { Prefer: "return=representation" } }
    ).then(
      (response: any) => {
        if (response.status === 200 && response.data.length > 0) {
          resolve(true);
        } else {
          reject("err activate item: response.status - " + response.status );
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
export function searchDuplicateEmail() {  // проверка на наличие дубликата записи
  return new Promise((resolve, reject) => {
    const changes: any = store.state.orgForm.changes;
    const origin: any = store.state.orgForm.origin;
    if (changes.email === undefined || changes.email === origin.email) {
      resolve([]);
      return;
    }
    let id = "";
    if (changes.id !== "" && changes.id !== null && changes.id !== undefined) {
      id = "id=neq." + changes.id + "&";
    }
    Vue.$axios.get("/api/org?" + id + "email=eq." + changes.email).then((response: any) => {
      if (response.status === 200) {
        resolve(response.data);
      } else {
        reject("err searchDuplicateEmail: response.status - " + response.status);
      }
    }, (err: any) => {
      reject(err);
    }).catch((error: any) => {
      reject(error);
    });
  });
}

// load DTO from server and transform to internal format
import Vue from "vue";
import store from "@/store/index";

export async function getItems(query) {
  const items: any = await Vue.$axios.get("/api/notice" + query, { headers: { Prefer: "count=exact" } }).then(
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
    const data = store.getters["noticeForm/ITEMS"];
    Vue.$axios.post("/api/notice",
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
    const data = store.getters["noticeForm/ITEMS"];
    Vue.$axios.patch("/api/notice?id=eq." + store.state.noticeForm.id,
      data,
      { headers: { Prefer: "return=representation" }}
    )
      .then(
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

export function deleteItem(id: number) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      Vue.$axios.delete("/api/notice?id=eq." + id
      ).then(
        (response: any) => {
          if (response.status === 204) {
            resolve(true);
          } else {
            reject("err deleteItem: response.status - " + response.status );
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
    Vue.$axios.patch("/api/notice?id=eq." + id,
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

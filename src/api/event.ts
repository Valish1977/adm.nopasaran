// load DTO from server and transform to internal format
import Vue from "vue";
import store from "@/store/index";

export async function getItems(query: any) {
  const items: any = await Vue.$axios.get("/api/event" + query, { headers: { Prefer: "count=exact" } }).then(
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
    const data = store.getters["eventForm/ITEMS"];
    Vue.$axios.post("/api/event",
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
    const data = store.getters["eventForm/ITEMS"];
    Vue.$axios.patch("/api/event?id=eq." + store.state.eventForm.id,
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

export function deleteItem(data: any) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {

      Vue.$axios.patch("/api/event?id=eq." + data.id,
        data,
        { headers: { Prefer: "return=representation" } }
      ).then(
        (response: any) => {
          if (response.status === 200 && response.data.length > 0) {
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
    Vue.$axios.patch("/api/event?id=eq." + id,
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

export function approved(val: boolean, id: number) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    Vue.$axios.patch("/api/event?id=eq." + id,
      {
        approved: val
      },
      { headers: { Prefer: "return=representation" } }
    ).then(
      (response: any) => {
        if (response.status === 200 && response.data.length > 0) {
          resolve(true);
        } else {
          reject("err approved item: response.status - " + response.status );
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

export function uploadPhoto(photoList: any) {
  return new Promise((resolve, reject) => {
    if ( photoList.length > 0 ) {
      const formData = new FormData();
      for (const p of photoList) {
        formData.append(p.response[0], p.raw);
      }
      Vue.$axios.post(
        "/services/upload/img",
        formData,
        { headers: {"content-type": "multipart/form-data"}}
      ).then((response: any) => {
        if (response.status === 200) {
          resolve(true);
        } else {
          reject("err upload: response.status - " + response.status );
        }
      }, (err: any) => {
        reject(err);
      }).catch((error: any) => {
        reject(error);
      });
    } else {
      resolve(true);
    }
  });
}

export function delPhoto(photoList: any) {
  return new Promise((resolve) => {
    if (photoList.length === 0) {
      resolve(true);
    } else {
      Vue.$axios.post(
        "/services/delete",
        photoList
      ).then((response: any) => {
        if (response.status === 200) {
          resolve(true);
        } else {
          resolve(true);
          // reject("err delPhoto: response.status - " + response.status )
        }
      }, () => {
        resolve(true);
        // reject(err);
      }).catch(() => {
        resolve(true);
        // reject(error)
      });
    }
});
}

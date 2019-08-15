// load DTO from server and transform to internal format
import Vue from "vue";

export async function getItems(query: any) {
  const items: any = await Vue.$axios.get( query ).then(
    (response: any) => {
      if (response.status === 200 || response.status === 206) {
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

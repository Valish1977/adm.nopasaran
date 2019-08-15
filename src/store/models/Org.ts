import { Model } from "@vuex-orm/core";
// models list client
export default class Org extends Model {
  public static entity = "org";
  public static fields() {
    return {
      id: this.increment(),
      name: this.string("").nullable(),
      geo_id: this.number(0).nullable(),
      geo: this.attr({}),
      url: this.string("").nullable(),
      email : this.string("").nullable(),
      comment: this.string("").nullable(),
      active: this.boolean(false)
    };
  }
}

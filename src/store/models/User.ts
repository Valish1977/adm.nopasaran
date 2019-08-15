import { Model } from "@vuex-orm/core";
// models list client
export default class User extends Model {
  public static entity = "user";
  public static fields() {
    return {
      id: this.increment(),
      org: this.attr({}),
      org_id: this.string("").nullable(),
      name: this.string("").nullable(),
      login: this.string("").nullable(),
      email : this.string("").nullable(),
      role: this.attr({}),
      role_code: this.string("").nullable(),
      active: this.boolean(false)
    };
  }
}

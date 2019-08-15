import { Model } from "@vuex-orm/core";
// models list notice
export default class Notice extends Model {
  public static entity = "notice";
  public static fields() {
    return {
      id: this.increment(),
      user_id: this.number(0).nullable(),
      topic: this.string("").nullable(),
      from_date: this.string("").nullable(),
      until_date: this.string("").nullable(),
      descr: this.string("").nullable(),
      active: this.boolean(false),
      actual: this.boolean(false)
    };
  }
}

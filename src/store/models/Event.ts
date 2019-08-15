import { Model } from "@vuex-orm/core";
// models list event
export default class Event extends Model {
  public static entity = "event";
  public static fields() {
    return {
      id: this.increment(),
      user_id: this.number(0),
      org_id: this.number(0),
      saved: this.string("").nullable(),
      type_id: this.number(0),
      type: this.attr({}),
      way_id: this.number(0),
      way: this.attr({}),
      geo_id: this.number(0),
      geo: this.attr({}),
      adress: this.string("").nullable(),
      edate: this.string("").nullable(),
      duration: this.number(0),
      reg_count: this.number(0),
      topic: this.string("").nullable(),
      descr: this.string("").nullable(),
      econtent: this.attr({}),
      ematerials: this.attr({}),
      tplparam: this.attr({}),
      active: this.boolean(false),
      approved: this.boolean(false),
      del: this.boolean(false),
      del_dts: this.string("").nullable(),
      del_reason: this.string("").nullable()
    };
  }
}

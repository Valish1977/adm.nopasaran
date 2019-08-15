import { Database } from "@vuex-orm/core";
import eventModel from "@/store/models/Event";
import eventModule from "@/store/modules/event";
import orgModel from "@/store/models/Org";
import orgModule from "@/store/modules/org";
import userModel from "@/store/models/User";
import userModule from "@/store/modules/user";
import noticeModel from "@/store/models/Notice";
import noticeModule from "@/store/modules/notice";

const database = new Database();

database.register(eventModel, eventModule);
database.register(orgModel, orgModule);
database.register(userModel, userModule);
database.register(noticeModel, noticeModule);
export default database;

<template>
  <div class="components-container">
    <el-row type="flex" class="row-bg" justify="space-between" style="margin: -20px 0 20px 0; border-bottom:1px solid #e6e6e6; padding-bottom:9px; text-align:right">
      <el-col :span="12">
        <quick-search :setParam="{'placeholder': $t('Event.quickSearch')}"></quick-search>
      </el-col>
      <el-col :span="5" align="right">
        <el-button type="primary" size="mini" plain @click="loadEventForm()" style="margin-top:3px">{{$t('Event.addEvent')}}</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:20px" justify="end">
       <el-col :span="24">
        <comp-filter></comp-filter>
      </el-col>
    </el-row>
    <el-row  :gutter="20" style="margin-bottom:15px" justify="end">
      <el-col :span="24">
        <el-table 
          stripe
          border
          style="width: 100%"
          size="mini"
          @expand-change="getExpandData"
          :data="tableItems"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
                <el-row  style="padding:5px 0">
                  <el-col :span="6">{{$t('Event.tableHeader.descr')}}</el-col><el-col :span="14"><strong>{{ props.row.descr }}</strong></el-col>
                </el-row>
                <el-row  style="padding:5px 0">
                  <el-col :span="6">{{$t('Event.tableHeader.topic')}}</el-col><el-col :span="14"><strong>{{ props.row.topic }}</strong></el-col>
                </el-row>
                <el-row  style="padding:5px 0">
                  <el-col :span="6">{{$t('Event.tableHeader.adress')}}</el-col><el-col :span="14"><strong>{{ props.row.adress }}</strong></el-col>
                </el-row>
                <el-row  style="padding:5px 0">
                    <el-col :span="6">{{$t('Event.tableHeader.formatEdate')}}</el-col><el-col :span="14"><strong>{{ props.row.formatEdate }}</strong></el-col>
                </el-row>
                <keep-alive  v-for="(line, index) in props.row.econtent" :key="index">
                  <el-row style="padding:5px 0" v-if="line.topic != ''">
                    <el-col v-if="index == 0"  style="margin-bottom:10px" :span="20"><strong>{{$t('Event.tableHeader.econtent')}}</strong></el-col>
                    <el-col :span="6" style="margin-bottom:10px" v-if="index == 0">{{$t('Event.form.content.topic.placeholder')}}</el-col>
                    <el-col :span="12" style="margin-bottom:10px" v-if="index == 0">{{$t('Event.form.content.descr.placeholder')}}</el-col>
                    <el-col :span="4" style="margin-bottom:10px" v-if="index == 0">{{$t('Event.form.content.speaker.placeholder')}}</el-col>
                    <el-col :span="2" style="margin-bottom:10px" v-if="index == 0">&nbsp;</el-col>
                    <el-col :span="6"><span style="color:#409EFF">{{ line.topic }}</span></el-col>
                    <el-col :span="12"><span style="color:#409EFF">{{ line.descr }}</span></el-col>
                    <el-col :span="4"><span style="color:#409EFF">{{ line.speaker }}</span></el-col>
                    <el-col :span="2"><img v-if="line.photoName != ''" style="width: 100px; height: 100px" :src="'/r/x600/'+line.photoAlias"></el-col>
                  </el-row>
                </keep-alive>
                <keep-alive  v-for="(line, index) in props.row.ematerials" :key="index">
                  <el-row style="padding:5px 0" v-if="line.name != ''">
                    <el-col v-if="index == 0"  style="margin-bottom:10px" :span="20"><strong>{{$t('Event.tableHeader.ematerial')}}</strong></el-col>
                    <el-col :span="6" style="margin-bottom:10px" v-if="index == 0">{{$t('Event.form.material.name.placeholder')}}</el-col>
                    <el-col :span="12" style="margin-bottom:10px" v-if="index == 0">{{$t('Event.form.material.author.placeholder')}}</el-col>
                    <el-col :span="6" style="margin-bottom:10px" v-if="index == 0">{{$t('Event.form.material.link.placeholder')}}</el-col>
                    <el-col :span="6"><span style="color:#409EFF">{{ line.name }}</span></el-col>
                    <el-col :span="12"><span style="color:#409EFF">{{ line.author }}</span></el-col>
                    <el-col :span="6"><span style="color:#409EFF">{{ line.link }}</span></el-col>
                  </el-row>
                </keep-alive>
            </template>
          </el-table-column>
          <el-table-column prop="id" width="80" sortable :label="this.$t('Event.tableHeader.link')">
            <template slot-scope="scope">
              <a :href="'http://nopasaran.su/event/'+getUrl(scope.row.edate)+'/'+scope.row.id">{{scope.row.id}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="descr" :label="this.$t('Event.tableHeader.descr')"></el-table-column>
          <el-table-column prop="edate" :label="this.$t('Event.tableHeader.edate')">
            <template slot-scope="scope">
              {{getDate(scope.row.edate)}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="type.name" :label="this.$t('Event.tableHeader.type_name')"></el-table-column>
          <el-table-column align="center" prop="way.name" :label="this.$t('Event.tableHeader.way_name')"></el-table-column>
          <el-table-column align="center" prop="geo.name" :label="this.$t('Event.tableHeader.geo_name')"></el-table-column>
          <el-table-column align="center" prop="reg_count" :label="this.$t('Event.tableHeader.reg_count')"></el-table-column>
          <el-table-column align="center" prop="active" :label="this.$t('Event.tableHeader.active')">
            <template slot-scope="scope">
              <el-checkbox :value="scope.row.active" @change="activateFn(!scope.row.active, scope.row.id)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="approved" :label="this.$t('Event.tableHeader.approved')">
            <template slot-scope="scope">
              <strong v-if="scope.row.approved" style="color:#409EFF; font-size:20px">&#10003;</strong>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="220">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.del"
                type="text"
                size="mini"
                @click="copyForm({id: scope.row.id});"
              >{{$t('Access.copy')}}</el-button>
              <el-button
                v-if="!scope.row.del"
                type="text"
                size="mini"
                @click="loadEventForm({id: scope.row.id});"
              >{{$t('Access.editCard')}}</el-button>
              <el-button
                v-if="!scope.row.del"
                type="text"
                size="mini"
                @click="dialogDelOpen(scope.row);"
              >{{$t('Access.delCard')}}</el-button>
              <span style="color:#F56C6C" v-if="scope.row.del">{{$t('Access.deleted')}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
          <el-pagination
            background
            @size-change="(val) => { $store.dispatch('app/setPaginationData', {name: 'limit', data: val}); setQuery()}"
            @current-change="(val) => { $store.dispatch('app/setPaginationData', {name: 'page', data: val}); setQuery()}"
            :current-page="$store.getters['app/getPaginationData'].page"
            :page-sizes="$store.getters['app/getPaginationData'].pageSize"
            :page-size="$store.getters['app/getPaginationData'].limit"
            layout="total, sizes, prev, pager, next"
            :total="$store.getters['app/getPaginationData'].total"
          ></el-pagination>
        </el-col>
    </el-row>
     <add-event></add-event>
    <edit-event></edit-event>
    <del-event :openDialogProps="dialogDelCard" :dataItem="editItem"></del-event>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { DateTime } from "luxon";
import Duration from "luxon/src/duration.js";
import AddEvent from "@/views/event/AddEvent.vue";
import EditEvent from "@/views/event/EditEvent.vue";
import DelEvent from "@/views/event/DelEvent.vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import {
  ACTIONS as FILTERS_ACTIONS,
  GETTERS as FILTERS_GETTERS
} from "@/store/modules/filters";
import { ACTIONS as REF_ACTIONS } from "@/store/modules/reference";
import { ACTIONS, MUTATIONS } from "@/store/modules/eventForm";
import CompFilter from "@/components/filters/CompFilter.vue";
import QuickSearch from "@/components/filters/QuickSearch.vue";
import { activate } from "@/api/event";

@Component({
  components: {
    AddEvent,
    EditEvent,
    DelEvent,
    CompFilter,
    QuickSearch
  },
  computed: {
    ...mapState("filters", ["filterStr"]),
    ...mapState("reference", ["references"]),
    ...mapGetters("filters", {
      filterStrQuery: FILTERS_GETTERS.STR_QUERY
    })
  },
  methods: {
    ...mapActions("filters", {
      setFilterModel: FILTERS_ACTIONS.SET_MODEL
    }),
    ...mapActions("eventForm", {
      loadEventForm: ACTIONS.LOAD,
      copyForm: ACTIONS.COPY,
      update: ACTIONS.UPDATE
    }),
    ...mapActions("reference", {
      setReference: REF_ACTIONS.SET_REFERENCE
    }),
    ...mapMutations("eventForm", {
      add: MUTATIONS.ADD
    })
  }
})
export default class EventCl extends Vue {
  private filterStrQuery!: any;
  private setFilterModel!: any;
  private loadUserForm!: any;
  private update!: any;
  private setReference!: any;
  private add!: any;
  private editItem: any = {};
  private dialogInfoCard: boolean = false; // окно информации
  private dialogDelCard: boolean = false; // окно удаления карты
  private filterModel: any = {};
  private opiItems: any = [];
  // life hook vue
  private created(): void {
    this.filterModel = {
      header_all: { header: "Общие сведения", group_id: 1 },
      descr: {
        component: "CompInput",
        group_id: 1,
        text: "Название события",
        params: {
          textView: "Название события",
          placeholder: "Название события"
        },
        quickSearch: {
          condition: "ilike"
        }
      },
      del: {
        component: "CompBool",
        group_id: 1,
        text: "Запись удалена",
        params: {
          textView: "Запись удалена",
          placeholder: "Запись удалена",
          reference: [
            { id: 1, name: this.$t("filters.components.CompBool.true") },
            { id: 2, name: this.$t("filters.components.CompBool.false") }
          ]
        },
        query: { condition: "is", operation: "and", value: false }
      }
    };
    this.setFilterModel(this.filterModel);
    this.setReference({ name: "ref_geo" });
    this.setReference({ name: "ref_event_type" });
    this.setReference({ name: "ref_event_way" });
  }
  // life hook vue
  private mounted(): void {
    this.setQuery();
  }
  get tableItems() {
    // реактивно формируем таблицу
    const items = this.$store.getters["entities/event"]()
      .orderBy("id", "desc")
      .get();
    for (const v in items) {
      if ( items[v].edate !== undefined ) {
        items[v].edate_view = this.getDate(items[v].edate);
      }
    }
    return items;
  }
  @Watch("filterStrQuery")
  private watchFilterStrQuery(): void {
    this.setQuery();
  }
  private dialogDelOpen(item): void {
    this.editItem = item;
    this.dialogDelCard = !this.dialogDelCard;
  }
  private setQuery(): void {
    this.$store.dispatch("entities/event/CREATE_EVENT", {
      filters:
        "?" +
        this.filterStrQuery +
        (this.filterStrQuery === "" ? "" : "&") +
        "limit=" +
        this.$store.getters["app/getPaginationData"].limit +
        "&offset=" +
        this.$store.getters["app/getPaginationData"].offset +
        "&order=id.desc" +
        "&select=*,way:way_id(name),type:type_id(name),geo:geo_id(name)"
    });
  }
  private activateFn(val, id): any {
    activate(val, id)
      .then(() => {
        let messageText = this.$t("notify.activateText") as string;
        if (!val) {
          messageText = this.$t("notify.activateText1") as string;
        }
        this.$notify({
          title: this.$t("notify.success") as string,
          type: "success",
          message: messageText
        });
        this.update({ id, data: { active: val } });
      })
      .catch((error: any) => {
        this.$notify({
          title: this.$t("notify.attention") as string,
          type: "error",
          message: this.$t("notify.error") as string
        });
        console.log(error);
      });
    return true;
  }
  private getExpandData(e): any {
    const duration: any = Duration.fromObject({
      days: 0,
      hours: 0,
      minutes: e.duration
    })
      .normalize()
      .toObject();
    const arr = e.edate.split(" ");
    let date = e.edate;
    if (arr.length > 1) {
      date = arr[0] + "T" + arr[1] + ":00+00:00";
    }
    e.formatEdate =
      DateTime.fromISO(date, { setZone: true }).toLocaleString({
        weekday: "long",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }) +
      "; " +
      this.$t("Event.tableHeader.duration.title") +
      ": " +
      (duration.days > 0
        ? " " + duration.days + this.$t("Event.tableHeader.duration.days")
        : "") +
      (duration.hours > 0
        ? " " + duration.hours + this.$t("Event.tableHeader.duration.hours")
        : "") +
      (duration.minutes > 0 ? " " + duration.minutes : " " + duration.minutes) +
      "" +
      this.$t("Event.tableHeader.duration.minutes");
  }
  private getUrl(t): any {
    if (DateTime.fromISO(t).ts > DateTime.local().ts) {
      return "new";
    } else {
      return "old";
    }
  }
  private getDate(date): any {
    const arr = date.split(" ");
    if (arr.length > 1) {
      date = arr[0] + "T" + arr[1] + ":00+00:00";
    }
    return DateTime.fromISO(date , { setZone: true }).toLocaleString(DateTime.DATETIME_SHORT);
  }
}
</script>
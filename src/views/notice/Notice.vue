<template>
  <div class="components-container">
    <el-row type="flex" class="row-bg" justify="space-between" style="margin: -20px 0 20px 0; border-bottom:1px solid #e6e6e6; padding-bottom:9px; text-align:right">
      <el-col :span="12">
        <quick-search :setParam="{'placeholder': $t('Notice.quickSearch')}"></quick-search>
      </el-col>
      <el-col :span="5" align="right">
        <el-button type="primary" size="mini" plain @click="loadNoticeForm()" style="margin-top:3px">{{$t('Notice.addNotice')}}</el-button>
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
          :data="tableItems"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
                <el-row v-if="props.row.descr!='' && props.row.descr!=null">
                  <el-col style="padding-bottom:12px" :span="6">{{$t('Notice.tableHeader.descr')}}</el-col><el-col :span="18"><strong>{{ props.row.descr }}</strong></el-col>
                </el-row>
              </template>
            </el-table-column>
          <el-table-column prop="topic" :label="this.$t('Notice.tableHeader.topic')"></el-table-column>
          <el-table-column prop="from_date" :label="this.$t('Notice.tableHeader.from_date')">
            <template slot-scope="scope">
                {{getDate(scope.row.from_date)}}
              </template>
          </el-table-column>
          <el-table-column prop="until_date" :label="this.$t('Notice.tableHeader.until_date')">
              <template slot-scope="scope">
                {{getDate(scope.row.until_date)}}
              </template>
            </el-table-column>
          <el-table-column prop="actual" width="100" align="center" :label="this.$t('Notice.tableHeader.actual')" >
            <template slot-scope="scope">
              <strong v-if="scope.row.actual" style="color:#409EFF; font-size:20px">&#10003;</strong>
            </template>
          </el-table-column>
          <el-table-column
            prop="active"
            width="100"
            align="center"
            :label="this.$t('Notice.tableHeader.active')"
          >
            <template slot-scope="scope">
              <el-checkbox
                :value="scope.row.active"
                @change="activateFn(!scope.row.active, scope.row.id)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="200">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="loadNoticeForm({id: scope.row.id});"
              >{{$t('Access.editCard')}}</el-button>
              <el-button
                type="text"
                size="mini"
                @click="dialogDelOpen(scope.row);"
              >{{$t('Access.delCard')}}</el-button>
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
     <add-notice></add-notice>
    <edit-notice></edit-notice>
    <del-notice :openDialogProps="dialogDelCard" :dataItem="editItem"></del-notice>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { DateTime } from "luxon";
import AddNotice from "@/views/notice/AddNotice.vue";
import EditNotice from "@/views/notice/EditNotice.vue";
import DelNotice from "@/views/notice/DelNotice.vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import {
  ACTIONS as FILTERS_ACTIONS,
  GETTERS as FILTERS_GETTERS
} from "@/store/modules/filters";
import { ACTIONS, MUTATIONS } from "@/store/modules/noticeForm";
import CompFilter from "@/components/filters/CompFilter.vue";
import QuickSearch from "@/components/filters/QuickSearch.vue";
import { activate } from "@/api/notice";

@Component({
  components: {
    AddNotice,
    EditNotice,
    DelNotice,
    CompFilter,
    QuickSearch
  },
  computed: {
    ...mapState("filters", ["filterStr"]),
    ...mapGetters("filters", {
      filtersStrQuery: FILTERS_GETTERS.STR_QUERY
    })
  },
  methods: {
    ...mapActions("filters", {
      setFilterModel: FILTERS_ACTIONS.SET_MODEL
    }),
    ...mapActions("noticeForm", {
      loadNoticeForm: ACTIONS.LOAD,
      update: ACTIONS.UPDATE
    }),
    ...mapMutations("noticeForm", {
      add: MUTATIONS.ADD
    })
  }
})
export default class Notice extends Vue {
  private editItem: any = {};
  private dialogInfoCard: boolean = false; // окно информации
  private dialogDelCard: boolean = false; // окно удаления карты
  private filterModel: any = {};
  // ...maps vuex (actions, mutations, getters)
  private filtersStrQuery!: any;
  private setFilterModel!: any;
  private loadNoticeForm!: any;
  private update!: any;
  private add!: any;

  private created(): void {
    this.filterModel = {
      header_all: { header: "Общие сведения", group_id: 1 },
      topic: {
        component: "CompInput",
        group_id: 1,
        text: "Заголовок",
        params: {
          textView: "Заголовок",
          placeholder: "Заголовок"
        },
        quickSearch: {
          condition: "ilike"
        }
      },
      from_date: {
        component: "CompDate",
        group_id: 1,
        text: "Начало показа",
        params: {
          textView: "Начало показа",
          placeholder: "Начало показа"
        }
      },
      until_date: {
        component: "CompDate",
        group_id: 1,
        text: "Окончание показа",
        params: {
          textView: "Окончание показа",
          placeholder: "Окончание показа"
        }
      },
      active: {
        component: "CompBool",
        group_id: 1,
        text: "Активно",
        params: {
          textView: "Объявление активно",
          placeholder: "Объявление активно",
          reference: [
            { id: 1, name: this.$t("filters.components.CompBool.true") },
            { id: 2, name: this.$t("filters.components.CompBool.false") }
          ]
        },
        query: { condition: "is", operation: "and", value: true }
      },
      actual: {
        component: "CompBool",
        group_id: 1,
        text: "Актуально",
        params: {
          textView: "Объявление актуально",
          placeholder: "Объявление актуально",
          reference: [
            { id: 1, name: this.$t("filters.components.CompBool.true") },
            { id: 2, name: this.$t("filters.components.CompBool.false") }
          ]
        },
        query: { condition: "is", operation: "and", value: true }
      }
    };
    this.setFilterModel(this.filterModel);
  }
  private mounted(): any {
    // делаем запрос в базу и записываем в стор
    this.setQuery();
  }
  get tableItems() {
    // реактивно формируем таблицу
    return this.$store.getters["entities/notice/all"]();
  }
  @Watch("filtersStrQuery")
  private watchFiltersStrQuery(): void {
    this.setQuery();
  }
  private dialogDelOpen(item): void {
    this.editItem = item;
    this.dialogDelCard = !this.dialogDelCard;
  }
  private setQuery(): void {
    this.$store.dispatch("entities/notice/CREATE_NOTICE", {
      filters:
        "?" +
        this.filtersStrQuery +
        (this.filtersStrQuery === "" ? "" : "&") +
        "limit=" +
        this.$store.getters["app/getPaginationData"].limit +
        "&offset=" +
        this.$store.getters["app/getPaginationData"].offset +
        "&order=id.desc"
    });
  }
  private getDate(e): string {
    return DateTime.fromISO(e).toLocaleString();
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
}
</script>

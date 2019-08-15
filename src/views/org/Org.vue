<template>
  <div class="components-container">
    <el-row
      type="flex"
      class="row-bg"
      justify="space-between"
      style="margin: -20px 0 20px 0; border-bottom:1px solid #e6e6e6; padding-bottom:9px; text-align:right"
    >
      <el-col :span="12">
        <quick-search :setParam="{'placeholder': $t('Org.quickSearch')}"></quick-search>
      </el-col>
      <el-col :span="5" align="right">
        <el-button
          type="primary"
          size="mini"
          plain
          @click="loadOrgForm()"
          style="margin-top:3px"
        >{{$t('Org.addOrg')}}</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:20px" justify="end">
      <el-col :span="24">
        <comp-filter></comp-filter>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:15px" justify="end">
      <el-col :span="24">
        <el-table stripe border style="width: 100%" size="mini" :data="tableItems">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-row style="padding:5px 0">
                <el-col :span="6">{{$t('Org.tableHeader.comment')}}</el-col>
                <el-col :span="14">
                  <strong>{{ props.row.comment}}</strong>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('Org.tableHeader.name')"></el-table-column>
          <el-table-column prop="email" :label="$t('Org.tableHeader.email')"></el-table-column>
          <el-table-column prop="geo.name" :label="$t('Org.tableHeader.geo_id')"></el-table-column>
          <el-table-column prop="url" :label="$t('Org.tableHeader.url')"></el-table-column>
          <el-table-column
            prop="active"
            width="100"
            align="center"
            :label="this.$t('Org.tableHeader.active')"
          >
            <template slot-scope="scope">
              <el-checkbox
                :value="scope.row.active"
                @change="activateFn(!scope.row.active, scope.row.id)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="150">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.del"
                type="text"
                size="mini"
                @click="loadOrgForm({id: scope.row.id});"
              >{{$t('Access.editCard')}}</el-button>
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
    <add-org></add-org>
    <edit-org></edit-org>
  </div>
</template>
<script lang="ts">
/* import qr from "qr-image-color"; */
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import AddOrg from "@/views/org/AddOrg.vue";
import EditOrg from "@/views/org/EditOrg.vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import {
  ACTIONS as FILTERS_ACTIONS,
  GETTERS as FILTERS_GETTERS
} from "@/store/modules/filters";
import { ACTIONS as REF_ACTIONS } from "@/store/modules/reference";
import { ACTIONS, MUTATIONS } from "@/store/modules/orgForm";
import CompFilter from "@/components/filters/CompFilter.vue";
import QuickSearch from "@/components/filters/QuickSearch.vue";
import { activate } from "@/api/org";
@Component({
  components: {
    AddOrg,
    EditOrg,
    CompFilter,
    QuickSearch
  },
  computed: {
    ...mapState("filters", ["filterStr"]),
    ...mapState("reference", ["references"]),
    ...mapGetters("filters", {
      filtersStrQuery: FILTERS_GETTERS.STR_QUERY
    })
  },
  methods: {
    ...mapActions("filters", {
      setFilterModel: FILTERS_ACTIONS.SET_MODEL
    }),
    ...mapActions("orgForm", {
      loadOrgForm: ACTIONS.LOAD,
      update: ACTIONS.UPDATE
    }),
    ...mapActions("reference", {
      setReference: REF_ACTIONS.SET_REFERENCE
    }),
    ...mapMutations("orgForm", {
      add: MUTATIONS.ADD
    })
  }
})
export default class Org extends Vue {
  private editItem: any = {};
  private dialogInfoCard: boolean = false; // окно информации
  private dialogDelCard: boolean = false; // окно удаления карты
  private opiItems: any = [];
  private filterModel: any = {};
  // ...maps vuex (actions, mutations, getters)
  private filtersStrQuery!: any;
  private setFilterModel!: any;
  private loadOrgForm!: any;
  private update!: any;
  private setReference!: any;
  private add!: any;

  private created(): void {
    this.filterModel = {
      header_all: { header: "Общие сведения", group_id: 1 },
      name: {
        component: "CompInput",
        group_id: 1,
        text: "Наименование организации",
        params: {
          textView: "Наименование организации",
          placeholder: "Укажите наименование организации"
        },
        quickSearch: {
          condition: "ilike"
        }
      },
      active: {
        component: "CompBool",
        group_id: 1,
        text: "Активна запись",
        params: {
          textView: "Активна запись",
          placeholder: "Активна запись",
          reference: [
            {
              id: 1,
              name: this.$t("filters.components.CompBool.true") as string
            },
            {
              id: 2,
              name: this.$t("filters.components.CompBool.false") as string
            }
          ]
        },
        query: { condition: "is", operation: "and", value: true }
      }
    };
    this.setFilterModel(this.filterModel);
    this.setReference({ name: "ref_geo" });
  }
  private mounted(): any {
    // делаем запрос в базу и записываем в стор
    this.setQuery();
  }
  get tableItems(): any {
    // реактивно формируем таблицу
    return this.$store.getters["entities/org"]()
      .orderBy("id", "desc")
      .get();
  }
  @Watch("filtersStrQuery")
  private WatchFiltersStrQuery(): void {
    this.setQuery();
  }
  private dialogDelOpen(item): void {
    this.editItem = item;
    this.dialogDelCard = !this.dialogDelCard;
  }
  private setQuery(): any {
    this.$store.dispatch("entities/org/CREATE_ORG", {
      filters:
        "?" +
        this.filtersStrQuery +
        (this.filtersStrQuery === "" ? "" : "&") +
        "limit=" +
        this.$store.getters["app/getPaginationData"].limit +
        "&offset=" +
        this.$store.getters["app/getPaginationData"].offset +
        "&order=id.desc" +
        "&select=*,geo:geo_id(name)"
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
}
</script>

<template>
  <div class="components-container">
    <el-row
      type="flex"
      class="row-bg"
      justify="space-between"
      style="margin: -20px 0 20px 0; border-bottom:1px solid #e6e6e6; padding-bottom:9px; text-align:right"
    >
      <el-col :span="12">
        <quick-search :setParam="{'placeholder': $t('User.quickSearch')}"></quick-search>
      </el-col>
      <el-col :span="5" align="right">
        <el-button
          type="primary"
          size="mini"
          plain
          @click="loadUserForm()"
          style="margin-top:3px"
        >{{$t('User.addUser')}}</el-button>
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
                <el-col :span="6">{{$t('User.tableHeader.url')}}</el-col>
                <el-col :span="14">
                  <strong>{{ props.row.url }}</strong>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="$t('User.tableHeader.name')"></el-table-column>
          <el-table-column prop="org.name" :label="$t('User.tableHeader.org_name')"></el-table-column>
          <el-table-column prop="login" :label="$t('User.tableHeader.login')"></el-table-column>
          <el-table-column prop="email" :label="$t('User.tableHeader.email')"></el-table-column>
          <el-table-column prop="role.name" :label="$t('User.tableHeader.role_code')"></el-table-column>
          <el-table-column
            prop="active"
            width="100"
            align="center"
            :label="this.$t('User.tableHeader.active')"
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
                v-if="!scope.row.del"
                type="text"
                size="mini"
                @click="loadUserForm({id: scope.row.id}); editType = 'profile'"
              >{{$t('Access.editCard')}}</el-button>
              <el-button
                v-if="!scope.row.del"
                type="text"
                size="mini"
                @click="loadUserForm({id: scope.row.id}); editType = 'pass'"
              >{{$t('Access.editPass')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="19">
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
      <el-col :span="5" align="right">
        <el-button-group>
          <el-button
            size="mini"
            style="width:140px"
            plain
            :loading="( $store.getters['app/getExcelData'].created && $store.getters['app/getExcelData'].key == 'allData')"
            @click="$store.dispatch('app/setExcelData', {name: 'data', data: paramsExcel, params:{created: true, group: 'allData', key: 'allData' }});"
          >{{ ( $store.getters['app/getExcelData'].created && $store.getters['app/getExcelData'].key == 'allData' ) ? $t("Access.loading") : $t("excel.export") }}</el-button>
          <el-button
            size="mini"
            plain
            @click="$store.dispatch('app/setExcelData', {name: 'data', data: paramsExcel, params:{settings: true, group: 'allData', key: 'allData'}});"
          >
            <i class="el-icon-setting"></i>
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <export-exel></export-exel>
    <add-user></add-user>
    <edit-user :editType="editType"></edit-user>
    <edit-pass :editType="editType"></edit-pass>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import AddUser from "@/views/user/AddUser.vue";
import EditUser from "@/views/user/EditUser.vue";
import EditPass from "@/views/user/EditPass.vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import {
  ACTIONS as FILTERS_ACTIONS,
  GETTERS as FILTERS_GETTERS
} from "@/store/modules/filters";
import { ACTIONS as REF_ACTIONS } from "@/store/modules/reference";
import { ACTIONS, MUTATIONS } from "@/store/modules/userForm";
import CompFilter from "@/components/filters/CompFilter.vue";
import QuickSearch from "@/components/filters/QuickSearch.vue";
import ExportExel from "@/components/ExportExel.vue";
import { activate } from "@/api/user";

@Component({
  components: {
    AddUser,
    EditUser,
    EditPass,
    CompFilter,
    QuickSearch,
    ExportExel
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
    ...mapActions("userForm", {
      loadUserForm: ACTIONS.LOAD,
      update: ACTIONS.UPDATE
    }),
    ...mapActions("reference", {
      setReference: REF_ACTIONS.SET_REFERENCE
    }),
    ...mapMutations("userForm", {
      add: MUTATIONS.ADD
    })
  }
})
export default class User extends Vue {
  private editType: string = ""; // prop для передачи в компонент тип вызываемой формы
  // ...maps vuex (actions, mutations, getters)
  private filtersStrQuery!: any;
  private setFilterModel!: any;
  private loadUserForm!: any;
  private update!: any;
  private setReference!: any;
  private add!: any;
  private editItem: any = {};
  private dialogInfoCard: boolean = false; // окно информации
  private dialogDelCard: boolean  = false; // окно удаления карты
  private filterModel: any = {};
  private created(): void {
    this.filterModel = {
      header_all: { header: "Общие сведения", group_id: 1 },
      name: {
        component: "CompInput",
        group_id: 1,
        text: "Имя профиля",
        params: {
          textView: "Имя профиля",
          placeholder: "Имя профиля"
        },
        quickSearch: {
          condition: "ilike"
        }
      },
      email: {
        component: "CompInput",
        group_id: 1,
        text: "email",
        params: {
          textView: "email",
          placeholder: "email"
        },
        quickSearch: {
          condition: "ilike*"
        }
      },
      login: {
        component: "CompInput",
        group_id: 1,
        text: "Логин",
        params: {
          textView: "Логин",
          placeholder: "Логин"
        },
        quickSearch: {
          condition: "ilike*"
        }
      },
      role_code: {
        component: "CompSelect",
        group_id: 1,
        text: "Выберите роль",
        params: {
          textView: "Роль",
          placeholder: "Выберите роль",
          reference: "ref_role",
          key: "code"
        },
        query: { condition: "eq", operation: "and", value: "cl" }
      },
      active: {
        component: "CompBool",
        group_id: 1,
        text: "Активна запись",
        params: {
          textView: "Активна запись",
          placeholder: "Активна запись",
          reference: [
            { id: 1, name: this.$t("filters.components.CompBool.true") },
            { id: 2, name: this.$t("filters.components.CompBool.false") }
          ]
        }
      }
    };
    this.setFilterModel(this.filterModel);
    this.setReference({ name: "ref_role" });
    this.initOrg();
  }
  get tableItems() {
    // реактивно формируем таблицу
    return this.$store.getters["entities/user"]()
      .orderBy("id", "desc")
      .get();
  }
  // lifecycle hook
  private mounted() {
    // делаем запрос в базу и записываем в стор
    this.setQuery();
  }

  @Watch("filtersStrQuery")
  private filtersStrQueryWatch() {
    this.setQuery();
  }
  get paramsExcel() {
    return {
      name: this.$t(this.$store.getters.getCurrentRoute.meta.pageName),
      tabs: [
        {
          name: this.$t(this.$store.getters.getCurrentRoute.meta.pageName),
          query:
            "/api/user?" +
            this.filtersStrQuery +
            (this.filtersStrQuery === "" ? "" : "&") +
            "&order=id.desc&select=*,role:role_code(name),org:org_id(*)",
          fields: [
            {
              field: "name",
              name: this.$t("User.tableHeader.name"),
              enabled: true
            },
            {
              field: "org.sname",
              name: this.$t("User.tableHeader.org_name"),
              enabled: true
            },
            {
              field: "login",
              name: this.$t("User.tableHeader.login"),
              enabled: true
            },
            {
              field: "email",
              name: this.$t("User.tableHeader.email"),
              enabled: true
            },
            {
              field: "role.name",
              name: this.$t("User.tableHeader.role_code"),
              enabled: true
            },
            {
              field: "active",
              fn: (v: any) => (v ? "✔" : ""),
              name: this.$t("User.tableHeader.active"),
              enabled: true
            }
          ]
        }
      ]
    };
  }
  private initOrg() {
    this.$store.dispatch("entities/org/CREATE_ORG", { filters: "" });
  }
  private dialogDelOpen(item) {
    this.editItem = item;
    this.dialogDelCard = !this.dialogDelCard;
  }
  private setQuery() {
    this.$store.dispatch("entities/user/CREATE_USER", {
      filters:
        "?" +
        this.filtersStrQuery +
        (this.filtersStrQuery === "" ? "" : "&") +
        "limit=" +
        this.$store.getters["app/getPaginationData"].limit +
        "&offset=" +
        this.$store.getters["app/getPaginationData"].offset +
        "&order=id.desc" +
        "&select=*,role:role_code(name),org:org_id(*)"
    });
  }
  private activateFn(val, id) {
    activate(val, id)
      .then(() => {
        let messageText: string = this.$t("notify.activateText") as string;
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


<template>
  <div>
    <el-form ref="myForm" :model="myForm">
      <el-form-item
        style="margin-bottom:0"
        prop="name"
        :rules="[
            { min: 0, max: 250, message: $t('filters.quickSearch.form.name.error'), trigger: ['blur', 'change'] },
            { validator: validateInput, trigger: ['blur', 'change']}
        ]"
      >
        <el-tooltip
          :content="compParam('placeholder')"
          placement="top-end"
          effect="light"
          :open-delay="500"
        >
          <el-input
            size="mini"
            clearable
            :placeholder="compParam('placeholder')"
            v-model="myForm.name"
          >
            <el-button
              slot="append"
              type="primary"
              :disabled="isLoading"
              @click.native="search()"
            >{{$t("filters.quickSearch.form.send")}}</el-button>
          </el-input>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { mapState, mapActions, mapGetters } from "vuex";
import { ACTIONS, GETTERS } from "@/store/modules/filters";
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
@Component({
  computed: {
    ...mapState("filters", ["model", "isLoading"])
  },
  methods: {
    ...mapActions("filters", {
      setQuickSearch: ACTIONS.SET_QUICK_SEARCH // делаем поисковый запрос
    })
  }
})
export default class QuickSearch extends Vue {
  @Prop({ default: null })
  public setParam: any;
  private param: any;
  private myForm: any;
  private validateInput: any;

  // ...maps vuex (actions, mutations, getters)
  private setQuickSearch: any;
  private isLoading: any;
  private model: any;

  constructor() {
    super();
    this.myForm = {
      name: null
    };
  }
  private created(): void {
    this.param = {
      placeholder: this.$t("filters.quickSearch.form.name.placeholder")
    };
    this.validateInput = (rule, value, callback) => {
      if (value === undefined || value === null || value === "") {
        callback();
        return true;
      }
      const regex = /^[А-Яа-яA-Za-z0-9sS_\.\-]*$/i;
      value = value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
      if (!regex.test(value)) {
        callback(
          new Error(this.$t("filters.quickSearch.form.name.error1") as string)
        );
        return true;
      }
    };
  }
  private search(): any {
    if (this.myForm.name !== "" && this.myForm.name !== null) {
      const value: any = this.myForm.name.replace(
        /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        ""
      );
      if (value === "") {
        return true;
      }
      const arr: any = [];
      for (const v in this.model) {
        if (this.model[v] !== undefined) {
          let val: any = value;
          if (this.model[v].component === "CompNumber") {
            val = Number(value);
            if (!Number.isFinite(val)) {
              continue;
            }
          }
          if (this.model[v].quickSearch) {
            arr.push({
              operation: "or",
              condition: this.model[v].quickSearch.condition,
              filter: this.model[v].key,
              component: this.model[v].component,
              value: val
            });
          }
        }
      }
      if (arr.length > 0) {
        this.setQuickSearch(arr);
      }
    }
  }
  private compParam(name: string): any {
    if (this.setParam[name] === undefined) {
      return this.param[name];
    }
    return this.setParam[name];
  }
}
</script>
<template>
  <div>
    <el-select
      style="width:100%"
      filterable
      v-model="fieldText"
      :placeholder="compParam('placeholder')"
      @change="fieldChange()"
    >
      <el-option v-for="item in referencesArr" :key="item.id" :value="item.id" :label="item.name"></el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import { mapState, mapActions } from "vuex";
import { ACTIONS as REF_ACTIONS } from "@/store/modules/reference";
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
@Component({
  computed: {
    ...mapState("reference", ["references"])
  },
  methods: {
    ...mapActions("reference", {
      setReference: REF_ACTIONS.SET_REFERENCE
    })
  }
})
export default class CompSelect extends Vue {
  @Prop({ default: null })
  public setValue: any;
  @Prop({ default: 0 })
  public setIndex: any;
  @Prop({ default: null })
  public setParam: any;

  private param: any;
  private referencesArr: any;
  private fieldText: any;

  // ...maps vuex (actions, mutations, getters)
  private setReference: any;
  private references: any;

  constructor() {
    super();
    this.param = {
      placeholder: "",
      reference: "",
      key: "id"
    };
    this.fieldText = null;
    this.referencesArr = [];
  }
  private updated(): void {
    this.$emit("beforeUpdate", this.setIndex);
    this.setRef();
  }
  private mounted(): void {
    this.fieldText = this.setValue;
    this.fieldChange();
    this.$emit("beforeMount", this.setIndex);
    this.setRef();
  }
  @Watch("setValue")
  private watchSetValue(): void {
    this.fieldText = this.setValue;
    this.fieldChange();
  }

  private setRef(): void {
    const ref = this.compParam("reference");
    if (Array.isArray(ref)) {
      this.referencesArr = ref;
    } else {
      this.setReference({ name: ref });
      this.referencesArr = this.references[ref];
      if (this.compParam("key") === "id") {
        if (this.references[ref][0].id === undefined) {
          console.log(
            "CompSelect: В справочнике отсутствует id. Задайте свой key!"
          );
        }
      } else {
        if (this.compParam("key") !== this.param.key) {
          const key = this.compParam("key");
          for (const i in this.referencesArr) {
            if (this.referencesArr[i] !== undefined) {
              this.referencesArr[i].id = this.referencesArr[i][key];
            }
          }
        }
      }
    }
  }
  private fieldChange(): void {
    this.$emit("getDataField", { value: this.fieldText, index: this.setIndex });
  }
  private compParam(name: string): any {
    if (this.setParam[name] === undefined) {
      return this.param[name];
    }
    return this.setParam[name];
  }
}
</script>
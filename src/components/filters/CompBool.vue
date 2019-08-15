<template>
  <div>
    <el-select
      style="width:100%"
      v-model="fieldText"
      :placeholder="compParam('placeholder')"
      @change="fieldChange()"
    >
      <el-option v-for="item in referencesArr" :key="item.id" :value="item.id" :label="item.name"></el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
@Component({})
export default class CompBool extends Vue {
  @Prop({ default: null })
  public setValue: any;
  @Prop({ default: 0 })
  public setIndex: any;
  @Prop({ default: null })
  public setParam: any;

  private param: any;
  private referencesArr: any;
  private fieldText: any;

  constructor() {
    super();
    this.param = {
      placeholder: "",
      reference: ""
    };
    this.fieldText = this.setValue ? 1 : 2;
  }
  private created(): void {
    this.referencesArr = [
      { id: 1, name: this.$t("filters.components.CompBool.true") },
      { id: 2, name: this.$t("filters.components.CompBool.false") }
    ];
  }
  private updated(): void {
    this.$emit("beforeUpdate", this.setIndex);
    this.referencesArr = this.compParam("reference");
  }
  private mounted() {
    this.fieldText = this.setValue ? 1 : 2;
    this.fieldChange();
    this.$emit("beforeMount", this.setIndex);
    this.referencesArr = this.compParam("reference");
  }

  @Watch("setValue")
  private watchSetValue() {
    this.fieldText = this.setValue ? 1 : 2;
    this.fieldChange();
  }

  private fieldChange(): void {
    this.$emit("getDataField", {
      value: (this.fieldText === 1) ? true : false,
      index: this.setIndex
    });
  }
  private compParam(name: string): any {
    if (this.setParam[name] === undefined) {
      return this.param[name];
    }
    return this.setParam[name];
  }
}
</script>
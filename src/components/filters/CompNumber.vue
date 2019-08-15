<template>
  <div>
    <el-input-number
      style="width:100%"
      clearable
      :placeholder="compParam('placeholder')"
      :min="compParam('min')"
      :max="compParam('max')"
      :precision="compParam('precision')"
      :step="compParam('step')"
      v-model="fieldText"
      @input="fieldChange()"
    ></el-input-number>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
@Component({})
export default class CompNumber extends Vue {
  @Prop({ default: null })
  public setValue: any;
  @Prop({ default: 0 })
  public setIndex: any;
  @Prop({ default: null })
  public setParam: any;

  private param: any;
  private fieldText: any;

  constructor() {
    super();
    this.param = {
      placeholder: "",
      min: 0,
      max: 100,
      precision: 1,
      step: 1
    };
    this.fieldText = "";
  }

  private updated(): void {
    this.$emit("beforeUpdate", this.setIndex);
  }
  private mounted(): void {
    this.fieldText = this.setValue;
    this.fieldChange();
    this.$emit("beforeMount", this.setIndex);
  }
  @Watch("setValue")
  private watchSetValue(): void {
    this.fieldText = this.setValue;
    this.fieldChange();
  }
  private fieldChange(): void {
    this.$emit("getDataField", {
      value: this.fieldText,
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
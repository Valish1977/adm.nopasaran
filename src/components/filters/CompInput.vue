<template>
  <div>
    <el-input
      style="width:100%"
      clearable
      :placeholder="compParam('placeholder')"
      v-model="fieldText"
      @input="fieldChange()"
    ></el-input>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
@Component({})
export default class CompInput extends Vue {
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
      placeholder: ""
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
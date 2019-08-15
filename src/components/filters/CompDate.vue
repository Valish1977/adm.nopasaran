<template>
  <div>
    <el-date-picker
      style="width:100%"
      :placeholder="compParam('placeholder')"
      :format="$t('filters.components.CompDate.formatTemplate')"
      :value-format="$t('filters.components.CompDate.formatTemplateValue')"
      @input="fieldChange()"
      v-model="fieldText"
    ></el-date-picker>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
export default class CompDate extends Vue {
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
    if (this.setValue !== undefined) {
      this.fieldText = this.setValue;
    } else {
      this.fieldText = "";
    }
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
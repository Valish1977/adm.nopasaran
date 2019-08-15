<template>
    <el-dialog :visible.sync="dialog"  width="60%" top="15vh" @close="dialog = false" append-to-body v-loading="delProgress" :element-loading-text="$t('Access.del.loading')" element-loading-spinner="el-icon-loading" :close-on-click-modal="false">
        <span  slot="title" class="dialog-title">{{$t('Access.del.title')}}: {{dataItem.name}}</span>
        <el-row :gutter="20">
          <el-col :span="24">
            <p>{{$t('Access.del.text')}}</p>
          </el-col>
          <el-col :span="24">
            <el-form label-width="300px" label-position="top">
                  <el-form-item :label="$t('Access.del.prefix')" >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('Access.del.placeholder')"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 10}"
                        v-model="comment"
                      ></el-input>
                  </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <span  slot="footer" class="dialog-footer">
            <el-row :gutter="20" justify="end">
                <el-col :span="24"  align="right">
                    <el-button type="info" size="mini" plain @click.native="dialog = false" v-if="!delProgress">{{$t('Access.del.cancel')}}</el-button>
                    <el-button type="primary" size="mini" plain @click.native="delItemFn()" v-if="!delProgress">{{$t('Access.del.remove')}}</el-button>
                </el-col>
            </el-row>
        </span>
    </el-dialog>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { deleteItem } from "@/api/event";
@Component({})
export default class DelEvent extends Vue {
  @Prop({ default: null })
  public openDialogProps: any;
  @Prop({ default: null })
  public dataItem: any;

  private comment: any = "";
  private delProgress: any = false;
  private dialog: any = false;

  @Watch("openDialogProps")
  private watchOpenDialogProps(): void {
    this.dialog = true;
  }
  private delItemFn(): any {
    this.delProgress = true;
    const data: any = { id: this.dataItem.id, del: true, del_reason: this.comment };
    deleteItem(data).then((response: any) => {
      if (response) {
        this.$notify({
          title: this.$t("notify.success") as string,
          type: "success",
          message: this.$t("notify.successTextDel") as string
        });
        this.$store.dispatch("entities/update", {
          entity: "event",
          where: this.dataItem.id,
          data: { del: true, del_reason: this.comment }
        });
        this.dialog = false;
      } else {
        this.$notify({
          title: this.$t("notify.attention") as string,
          type: "error",
          message: this.$t("notify.error") as string
        });
      }
      this.delProgress = false;
      return true;
    });
  }
}
</script>

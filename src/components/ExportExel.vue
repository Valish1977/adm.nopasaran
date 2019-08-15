<template>
  <el-dialog align="left" :title="$t('excel.title')" :visible.sync="settings" width="600px">
    <div v-if="checkedItems.length > 0" style="max-height:400px; overflow-y:auto">
      <el-row style="margin:0 15px;" v-for="(i, k) in params.tabs" :key="k">
        <el-divider content-position="left">{{i.name}}</el-divider>
        <el-checkbox-group v-model="checkedItems[k]">
          <el-row :gutter="20">
            <el-col
              :span="12"
              style="margin-bottom:15px;"
              v-for="(item, key) in i.fields"
              :key="key"
            >
              <el-checkbox :label="item.field">{{item.name}}</el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-row>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import exceljs from "exceljs/dist/es5/exceljs.browser";
import { getItems } from "@/api/excel";
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
@Component({})
export default class ExportExelM extends Vue {
  private selfGroup: any = "";
  private settings: any = false;
  private checkedItems: any = [];
  @Watch("createdd")
  private watchCreatedd() {
    if (this.createdd) {
      this.tabExel();
    }
  }
  @Watch("params")
  private watchParams() {
    if (this.selfGroup !== this.group) {
      this.selfGroup = this.group;
      this.setList();
    }
  }
  @Watch("sett")
  private watchSett() {
    this.settings = this.sett;
  }
  @Watch("settings")
  private watchSettings() {
    if (!this.settings && this.settings !== this.sett) {
      this.$store.dispatch("app/setExcelData", {
        name: "settings",
        data: false
      });
    }
  }
  get language(): any {
    return this.$store.getters.language;
  }
  get createdd(): any {
    return this.$store.getters["app/getExcelData"].created;
  }
  get sett(): any {
    return this.$store.getters["app/getExcelData"].settings;
  }
  get group(): any {
    return this.$store.getters["app/getExcelData"].group;
  }
  get params(): any {
    return this.$store.getters["app/getExcelData"].data;
  }
  private setList() {
    this.checkedItems = [];
    for (const v of this.params.tabs) {
      const arr: any = [];
      for (const t of v.fields) {
        if (t.enabled) {
          arr.push(t.field);
        }
      }
      this.checkedItems.push(arr);
    }
  }
  private async tabExel() {
    const data: any = [];
    for (const i in this.params.tabs) {
      if (this.params.tabs[i] !== undefined) {
        const items = await getItems(this.params.tabs[i].query);
        if (items.length === 0) {
          return;
        }
        const columns: any = [];
        for (const v in this.checkedItems[i]) {
          if (this.checkedItems[i][v] !== undefined) {
            const item: any = this.params.tabs[i].fields.find(
              (t: any) => t.field === this.checkedItems[i][v]
            );
            columns.push({ header: item.name, key: "cell" + v, width: 20 });
          }
        }
        const rows: any = [];
        for (const v of items) {
          const arr: any = [];
          let key = 0;
          for (const n of this.checkedItems[i]) {
            const item = this.params.tabs[i].fields.find(
              (t: any) => t.field === n
            );
            if (item.field.indexOf(".") !== -1) {
              const a = item.field.split(".");
              switch (a.length) {
                case 2:
                  arr[key] = v[a[0]][a[1]];
                  break;
                case 3:
                  arr[key] = v[a[0]][a[1]][a[2]];
                  break;
                case 4:
                  arr[key] = v[a[0]][a[1]][a[2]][a[3]];
                  break;
                default:
                  arr[key] = "";
              }
            } else {
              if (item.fn !== undefined) {
                arr[key] = item.fn(v[item.field], v);
              } else {
                arr[key] = v[item.field];
              }
            }
            key++;
          }
          rows.push(arr);
        }
        data.push({
          columns,
          rows,
          name: this.params.tabs[i].name
        });
      }
    }
    this.viewExel(data);
  }
  private viewExel(data: any): any {
    const name = this.params.name;
    const wb: any = new exceljs.Workbook();
    for (const v of data) {
      const ws = wb.addWorksheet(v.name);
      ws.columns = v.columns;
      ws.addRows(v.rows);
    }
    wb.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], { type: "application/vnd.ms-excel" });
      const link: any = document.createElement("a");
      link.style = "display: none";
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = name + ".xlsx";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 0);
    });
    setTimeout(() => {
      this.$store.dispatch("app/setExcelData", {
        data: false,
        name: "created"
      });
    }, 500);
  }
}
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  padding-right: 2px;
}
</style>


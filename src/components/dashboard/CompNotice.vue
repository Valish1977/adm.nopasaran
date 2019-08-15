<template>
  <el-row :gutter="20" style="margin-bottom:20px" v-if="tableData.length > 0">
    <el-col :offset="1" :span="22" style="text-align:left; margin-bottom:0px;">
      <h3 style>{{$t('Notice.h3')}}</h3>
    </el-col>
    <el-col :offset="1" :span="22" class="form-container">
      <el-alert
        v-for="item in tableData"
        :key="item.id"
        style="margin-bottom:30px; padding:20px"
        :title="item.topic + ' ( ' + item.saved + ' )'"
        :type="item.ntype"
        :description="item.descr"
        :closable="false"
        show-icon
      ></el-alert>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DateTime } from "luxon";
@Component({})
export default class CompNotice extends Vue {
  private tableData: any = [];
  private created(): any {
    this.getData()
      .then((data: any) => {
        if (data) {
          for (const v in data) {
            if (data[v] !== undefined) {
              data[v].saved = DateTime.fromISO(data[v].saved).toLocaleString();
            }
          }
          this.tableData = data;
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
  private getData(): any {
    return new Promise((resolve, reject) => {
      this.$axios
        .get("/api/notice")
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          console.log(error);
          reject(error);
        });
    });
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "../../styles/variables.scss";
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.box-card {
  margin: 0 0 20px 0;
  .box-header {
    padding: 8px 15px;
    background-color: #f5f5f5;
    font-size: 15px;
  }
  .box-body {
    border-bottom: 1px solid #ccc;
    padding: 0 15px;
    line-height: 34px;
  }
}
</style>
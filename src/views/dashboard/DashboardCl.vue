<template>
  <div class="components-container">
    <comp-notice></comp-notice>
    <!-- <el-row :gutter="20" style="margin-bottom:20px">
      <el-col :span="24">
        <comp-event></comp-event>
      </el-col>
    </el-row>-->
    <!-- <a  @click="setFilter()" >Тестовый фильтр</a> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapActions } from "vuex";
import { ACTIONS } from "@/store/modules/filters";
/* import CompEvent from "@/components/dashboard/CompEvent.vue"; */
import CompNotice from "@/components/dashboard/CompNotice.vue";
@Component({
  components: {
    CompNotice
  },
  methods: {
    ...mapActions("filters", {
      requestFilter: ACTIONS.SET_REQUEST_FILTER // перезаписывает условия набираемого фильтра в stor
    })
  }
})
export default class DashboardCl extends Vue {
  private requestFilter!: any;
  private setFilter(): void {
    this.requestFilter([
      { filter: "select", condition: "neq", operation: "and", value: 1 },
      { filter: "select", condition: "neq", operation: "and", value: 2 },
      { filter: "card", condition: "eq", operation: "or", value: "wewe" }
    ]);
    this.$router.push({ path: "/cl/sale" });
  }
}
</script>


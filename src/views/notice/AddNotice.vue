<template>
  <div>
    <el-dialog
      :visible="isVisible && type == 'add'"
      width="1000px"
      top="5vh"
      @close="closeForm()"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-title">{{$t("Notice.addNoticeTitle")}}</span>
      <el-alert
        style="margin-bottom:15px"
        v-if="alertText != '' "
        :title="alertText"
        type="warning"
        :closable="false"
        center
        show-icon
      ></el-alert>
      <el-form
        ref="myForm"
        :model="myForm"
        label-width="300px"
        label-position="right"
        status-icon
        v-loading="isLoading || isSaving || selfLoading"
        :element-loading-text="$t('Access.loading')"
        element-loading-spinner="el-icon-loading"
      >
        <el-row>
          <el-col :span="24" class="form-container">
            <el-row :gutter="20">
                <el-col :span="22">
                    <el-form-item
                      prop="active"
                    >
                        <el-checkbox
                        style="width:100%"
                          v-model="myForm.active"
                          @change="modifyFn({name:'active', data: myForm.active})"
                        >{{$t('Notice.form.active.placeholder')}}</el-checkbox>
                      </el-form-item>
                  </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-form-item required :label="$t('Notice.form.topic.prefix')" style="margin-bottom:0">
                <el-col :span="22">
                  <el-form-item
                    prop="topic"
                    :rules="[
                            { required: true, message: $t('Notice.form.topic.error'), trigger: 'blur' },
                            { min: 1, max: 50, message: $t('Notice.form.topic.error2'), trigger: ['blur', 'change'] }
                          ]"
                  >
                    <el-tooltip
                      :content="$t('Notice.form.topic.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('Notice.form.topic.placeholder')"
                        v-model="myForm.topic"
                        @input="modifyFn({name:'topic', data: myForm.topic})"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item
                required
                :label="$t('Notice.form.from_date.prefix')"
                style="margin-bottom:0"
              >
                <el-col :span="11">
                  <el-form-item
                    prop="from_date"
                    :rules="[
                            { required: true, message: $t('Notice.form.from_date.error'), trigger: 'blur' },
                          ]"
                  >
                    <el-tooltip
                      :content="$t('Notice.form.from_date.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-date-picker
                        style="width:100%"
                        clearable
                        type="date"
                        :placeholder="$t('Notice.form.from_date.placeholder')"
                        v-model="myForm.from_date"
                        :format="$t('filters.components.CompDate.formatTemplate')"
                        :value-format="$t('filters.components.CompDate.formatTemplateValue')"
                        @input="modifyFn({name:'from_date', data: myForm.from_date})"
                      ></el-date-picker>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    prop="until_date"
                    :rules="[
                            { required: true, message: $t('Notice.form.until_date.error'), trigger: 'blur' },
                          ]"
                  >
                    <el-tooltip
                      :content="$t('Notice.form.until_date.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-date-picker
                        style="width:100%"
                        clearable
                        type="date"
                        :placeholder="$t('Notice.form.until_date.placeholder')"
                        v-model="myForm.until_date"
                        :format="$t('filters.components.CompDate.formatTemplate')"
                        :value-format="$t('filters.components.CompDate.formatTemplateValue')"
                        @input="modifyFn({name:'until_date', data: myForm.until_date})"
                      ></el-date-picker>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item :label="$t('Notice.form.descr.prefix')" style="margin-bottom:0">
                <el-col :span="22">
                  <el-form-item prop="descr">
                    <el-tooltip
                      :content="$t('Notice.form.descr.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('Notice.form.descr.placeholder')"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 10}"
                        v-model="myForm.descr"
                        @input="modifyFn({name:'descr', data: myForm.descr})"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="12">
            <p class="el-form-item__label" style="margin:0; padding:0">
              <span style="color:red">*</span>
              <span>{{$t("Access.requiredField")}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <el-button
              type="info"
              size="mini"
              plain
              @click.native="resetForm()"
              :disabled="!isChanged || isLoading || isSaving || selfLoading"
            >{{$t("Access.clear")}}</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              @click.native="submitForm()"
              :disabled="!isChanged || isLoading || isSaving || selfLoading"
            >{{$t("Access.saved")}}</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>


<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { ACTIONS, GETTERS, MUTATIONS } from "@/store/modules/noticeForm";
import { insertItem } from "@/api/notice";
export type VForm = Vue & { validate: () => boolean };
@Component({
  computed: {
    ...mapState("noticeForm", ["isVisible", "isLoading", "isSaving", "type"]),
    ...mapState("reference", ["references"]),
    ...mapGetters("noticeForm", {
      myForm: GETTERS.ITEMS,
      isChanged: GETTERS.IS_CHANGED
    }),
    selfForm(): VForm {
      return this.$refs.myForm as VForm;
    }
  },
  methods: {
    ...mapActions("noticeForm", {
      close: ACTIONS.CLOSE,
      save: ACTIONS.SAVE
    }),
    ...mapMutations("noticeForm", {
      modify: MUTATIONS.MODIFY,
      remove: MUTATIONS.REMOVE,
      reset: MUTATIONS.RESET_CHANGES
    })
  }
})
export default class AddNotice extends Vue {
  private selfForm: any;
  // ...mapState reference
  private references!: any;
  // ...mapState userForm
  private isVisible!: boolean;
  private isLoading!: boolean;
  private isSaving!: boolean;
  private type!: string;
  // ...mapGetters userForm
  private myForm!: any;
  private isChanged!: any;
  // ...mapActions userForm
  private close!: any;
  private save!: any;
  // ...mapMutations userForm
  private modify!: any;
  private rmove!: any;
  private reset!: any;
  // property
  private loadForm: any = false; // позволяет блокировать дублирующие изменения, в т.ч. при загрузке формы (критично!)
  private alertText: any = "";
  private dataLoaded: any = false; // загружены данные в форму или нет
  private selfLoading: any = true; //  загрузка в true чтобы скрыть сброс полей и загрузку полей (исключить дергание)
  // life hook

  @Watch("myForm")
  private watchMyForm() {
    // костыль на обработку сброса формы (предыдущей записи) при повторном открытии (критично!)
    if (
      this.isVisible &&
      Object.keys(this.myForm).length > 0 &&
      this.type === "add" &&
      !this.dataLoaded
    ) {
      this.dataLoaded = true;
      setTimeout(() => {
        this.selfLoading = false;
      }, 500);
    }
  }
  private beforeUpdate(): void {
    this.loadForm = false;
  }
  private updated(): void {
    this.loadForm = true;
  }
  private modifyFn(data): void {
    if (this.loadForm) {
      this.modify(data);
    }
  }
  private resetForm(): void {
    this.reset();
    this.selfForm.resetFields();
    this.alertText = "";
  }
  private closeForm(): void {
    this.close();
    this.selfLoading = true;
    this.dataLoaded = false;
  }
  private submitForm(): void {
    this.selfForm.validate((valid: boolean) => {
      // проверка валидности формы
      if (!valid) {
        this.$notify({
          title: this.$t("notify.attention") as string,
          type: "warning",
          message: this.$t("notify.errorData") as string
        });
        return;
      }
      this.modify({name: "user_id", data: this.$store.getters.getUser.id});
      this.selfLoading = true;
      insertItem()
        .then((data: any) => {
          this.$notify({
            title: this.$t("notify.success") as string,
            type: "success",
            message: this.$t("notify.successText1") as string
          });
          // сохраняем измененения в store и закрываем

          this.save(data);
          this.close();
          return;
        })
        .catch((error: any) => {
          this.$notify({
            title: this.$t("notify.attention") as string,
            type: "error",
            message: this.$t("notify.error") as string
          });
          console.log(error);
          return;
        });
    });
  }
}
</script>

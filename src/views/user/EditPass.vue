

<template>
  <div>
    <el-dialog
      :visible="isVisible && type == 'edit' && editType == 'pass'"
      width="600px"
      top="5vh"
      @close="closeForm()"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-title">{{$t("User.editPassTitle")}}</span>
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
        label-width="200px"
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
                  :label="$t('User.form.hash.prefix')"
                  required
                  prop="hash"
                  :rules="[ { required: true, message: $t('User.form.hash.error'), trigger: 'change' },
                    { min: 1, max: 100, message: $t('User.form.hash.error2'), trigger: ['blur', 'change'] }]"
                >
                  <el-tooltip
                    :content="$t('User.form.hash.placeholder')"
                    placement="top-end"
                    effect="light"
                    :open-delay="500"
                  >
                    <el-input
                      style="width:100%"
                      clearable
                      :placeholder="$t('User.form.hash.placeholder')"
                      v-model="myForm.hash"
                      @input="modifyFn({name:'hash', data: myForm.hash})"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="22">
                <el-form-item
                  :label="$t('User.form.hash2.prefix')"
                  required
                  prop="hash"
                  :rules="[ { required: true, message: $t('User.form.hash2.error'), trigger: 'change' },
                    { min: 1, max: 100, message: $t('User.form.hash2.error2'), trigger: ['blur', 'change'] },
                    { validator: validateHash, trigger: ['blur', 'change']} ]"
                >
                  <el-tooltip
                    :content="$t('User.form.hash2.placeholder')"
                    placement="top-end"
                    effect="light"
                    :open-delay="500"
                  >
                    <el-input
                      style="width:100%"
                      clearable
                      :placeholder="$t('User.form.hash2.placeholder')"
                      v-model="myForm.hash2"
                      @input="modifyFn({name:'hash2', data: myForm.hash2})"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
              </el-col>
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
import { ACTIONS, GETTERS, MUTATIONS } from "@/store/modules/userForm";
import { updatePass } from "@/api/user";
export type VForm = Vue & { validate: () => boolean };
@Component({
  computed: {
    ...mapState("userForm", ["isVisible", "isLoading", "isSaving", "type"]),
    ...mapGetters("userForm", {
      myForm: GETTERS.ITEMS,
      isChanged: GETTERS.IS_CHANGED
    }),
    selfForm(): VForm {
      return this.$refs.myForm as VForm;
    }
  },
  methods: {
    ...mapActions("userForm", {
      close: ACTIONS.CLOSE,
      save: ACTIONS.SAVE
    }),
    ...mapMutations("userForm", {
      modify: MUTATIONS.MODIFY,
      remove: MUTATIONS.REMOVE,
      reset: MUTATIONS.RESET_CHANGES
    })
  }
})
export default class EditPass extends Vue {
  @Prop({ default: null })
  public editType: any;

  private selfForm: any;
  // propertys
  private loadForm: any = false; // позволяет блокировать дублирующие изменения, в т.ч. при загрузке формы (критично!)
  private alertText: any = "";
  private dataLoaded: any = false; // загружены данные в форму или нет
  private selfLoading: any = true; //  загрузка в true чтобы скрыть сброс полей и загрузку полей (исключить дергание)
  // validators
  private validateHash: any;
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

  private created(): void {
    this.validateHash = (rule, value, callback) => {
      if (value === undefined || value === null || value === "") {
        callback("");
        return true;
      }
      if (this.myForm.hash !== this.myForm.hash2) {
        callback(new Error(this.$t("User.form.hash.error3") as string));
        return false;
      } else {
        callback("");
        return true;
      }
    };
  }
  @Watch("myForm")
  private watchMyForm() {
    // костыль на обработку сброса формы (предыдущей записи) при повторном открытии (критично!)
    if (
      this.isVisible &&
      Object.keys(this.myForm).length > 0 &&
      this.type === "edit" &&
      this.editType === "pass" &&
      !this.dataLoaded
    ) {
      this.dataLoaded = true;
      this.setDataForm();
      setTimeout(() => {
        this.selfLoading = false;
      }, 500);
    }
  }
  // life hook
  private beforeUpdate(): void {
    this.loadForm = false;
  }
  // life hook
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
  private setDataForm(): any {
    this.modify({ name: "hash", data: "" });
    this.modify({ name: "hash2", data: "" });
  }
  private submitForm(): any {
    this.selfForm.validate((valid: boolean) => {
      if (this.myForm.hash !== this.myForm.hash2) {
        this.$notify({
          title: this.$t("notify.attention") as string,
          type: "error",
          message: this.$t("notify.dublicateHash") as string
        });
        return true;
      }
      if (!valid) {
        this.$notify({
          title: this.$t("notify.attention") as string,
          type: "warning",
          message: this.$t("notify.errorData") as string
        });
        return false;
      }
      this.selfLoading = true;
      updatePass()
        .then((data: any) => {
          this.$notify({
            title: this.$t("notify.success") as string,
            type: "success",
            message: this.$t("notify.successText2") as string
          });
          this.save(data);
          this.close();
          return true;
        })
        .catch((error: any) => {
          this.$notify({
            title: this.$t("notify.attention") as string,
            type: "error",
            message: this.$t("notify.error") as string
          });
          return false;
        });
    });
  }
}
</script>



<template>
  <div>
    <el-dialog
      :visible="isVisible && type == 'edit'"
      width="1000px"
      top="5vh"
      @close="closeForm()"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-title">{{$t("Org.editOrgTitle")}}</span>
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
        element-loading-spcommenter="el-icon-loading"
      >
        <el-row>
          <el-col :span="24" class="form-container">
            <el-row :gutter="20">
              <el-form-item
                :label="$t('Org.form.geo_id.placeholder')"
                style="margin-bottom:0"
                required
              >
                <el-col :span="11">
                  <el-form-item
                    prop="geo_id"
                    :rules="[
                            { required: true, message: $t('Org.form.geo_id.error'), trigger: 'change' }
                          ]"
                  >
                    <el-tooltip
                      :content="$t('Org.form.geo_id.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-select
                        style="width:100%"
                        v-model="myForm.geo_id"
                        filterable
                        :placeholder="$t('Org.form.geo_id.placeholder')"
                        @change="modifyFn({name:'geo_id', data: myForm.geo_id})"
                      >
                        <el-option
                          v-for="item in references['ref_geo']"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item prop="active" style="margin-bottom:0">
                    <el-checkbox
                      style="width:100%"
                      v-model="myForm.active"
                      @change="modifyFn({name:'active', data: myForm.active})"
                    >{{$t('Org.form.active.placeholder')}}</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item :label="$t('Org.form.name.prefix')" style="margin-bottom:0" required>
                <el-col :span="22">
                  <el-form-item
                    prop="name"
                    :rules="[
                        { required: true, message: $t('Org.form.name.error'), trigger: 'blur' }, 
                        { min: 1, max: 250, message: $t('Org.form.name.error2'), trigger: ['blur', 'change'] }
                      ]"
                  >
                    <el-tooltip
                      :content="$t('Org.form.name.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('Org.form.name.placeholder')"
                        v-model="myForm.name"
                        @input="modifyFn({name:'name', data: myForm.name})"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="11"></el-col>
              </el-form-item>
            </el-row>

            <el-row :gutter="20">
              <el-form-item :label="$t('Org.form.email.prefix')" style="margin-bottom:0" required>
                <el-col :span="22">
                  <el-form-item
                    prop="email"
                    :rules="[
                        { required: true, message: $t('Org.form.email.error'), trigger: 'blur' }, 
                        { min: 1, max: 100, message: $t('Org.form.email.error2'), trigger: ['blur', 'change'] },
                        { validator: validateEmail, trigger: ['blur']}
                      ]"
                  >
                    <el-tooltip
                      :content="$t('Org.form.email.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('Org.form.email.placeholder')"
                        v-model="myForm.email"
                        @input="modifyFn({name:'email', data: myForm.email})"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item :label="$t('Org.form.url.placeholder')" style="margin-bottom:0">
                <el-col :span="22">
                  <el-form-item
                    prop="url"
                    :rules="[
                        { min: 0, max: 250, message: $t('Org.form.url.error2'), trigger: ['blur', 'change'] } ]"
                  >
                    <el-tooltip
                      :content="$t('Org.form.url.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('Org.form.url.placeholder')"
                        v-model="myForm.url"
                        @input="modifyFn({name:'url', data: myForm.url})"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item :label="$t('Org.form.comment.prefix')" style="margin-bottom:0">
                <el-col :span="22">
                  <el-form-item prop="comment">
                    <el-tooltip
                      :content="$t('Org.form.comment.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('Org.form.comment.placeholder')"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 10}"
                        v-model="myForm.comment"
                        @input="modifyFn({name:'comment', data: myForm.comment})"
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



<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { ACTIONS, GETTERS, MUTATIONS } from "@/store/modules/orgForm";
import { updateItem, searchDuplicateEmail } from "@/api/org";
export type VForm = Vue & { validate: () => boolean };
@Component({
  computed: {
    ...mapState("reference", ["references"]),
    ...mapState("orgForm", ["isVisible", "isLoading", "isSaving", "type"]),
    ...mapGetters("orgForm", {
      myForm: GETTERS.ITEMS,
      isChanged: GETTERS.IS_CHANGED
    }),
    selfForm(): VForm {
      return this.$refs.myForm as VForm;
    }
  },
  methods: {
    ...mapActions("orgForm", {
      close: ACTIONS.CLOSE,
      save: ACTIONS.SAVE
    }),
    ...mapMutations("orgForm", {
      modify: MUTATIONS.MODIFY,
      remove: MUTATIONS.REMOVE,
      reset: MUTATIONS.RESET_CHANGES
    })
  }
})
export default class EditOrg extends Vue {
  private selfForm: any;
  // validators
  private validateEmail: any;
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
  private created(): void {
    // validators callback functions
    this.validateEmail = (rule, value, callback) => {
      if (value === undefined || value === null || value === "") {
        callback();
        return true;
      }
      searchDuplicateEmail().then((data: any) => {
        if (data !== false) {
          if (data.length > 0) {
            this.alertText = this.$t("notify.dublicateEmail");
            callback(new Error(this.$t("Org.form.email.error3") as string));
          } else {
            this.alertText = "";
            callback();
          }
          return true;
        }
        this.$notify({
          title: this.$t("notify.attention") as string,
          type: "error",
          message: this.$t("notify.error") as string
        });
        callback();
        return true;
      });
    };
  }
  @Watch("myForm")
  private watchMyForm(): void {
    // костыль на обработку сброса формы (предыдущей записи) при повторном открытии (критично!)
    if (
      this.isVisible &&
      Object.keys(this.myForm).length > 0 &&
      this.type === "edit" &&
      !this.dataLoaded
    ) {
      this.dataLoaded = true;
      setTimeout(() => {
        this.selfLoading = false;
      }, 500);
    }
  }
  // vue life hook
  private beforeUpdate(): void {
    this.loadForm = false;
  }
  // vue life hook
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
      this.selfLoading = true;
      searchDuplicateEmail()
        .then((data: any) => {
          // проверка на наличие аналога записи
          if (data !== false) {
            if (data.length > 0) {
              this.$notify({
                title: this.$t("notify.attention") as string,
                type: "error",
                message: this.$t("notify.dublicateEmail") as string
              });
              throw new Error("dublicate email");
            }
            return true;
          } else {
            this.$notify({
              title: this.$t("notify.attention") as string,
              type: "error",
              message: this.$t("notify.error") as string
            });
            throw new Error("error");
          }
        })
        .then(() => {
          updateItem()
            .then((data: any) => {
              this.$notify({
                title: this.$t("notify.success") as string,
                type: "success",
                message: this.$t("notify.successText2") as string
              });
              // сохраняем измененения в store и закрываем
              const v = this.references.ref_geo.find(
                (t: any) => t.id.toString() === this.myForm.geo_id.toString()
              );
              const lang = this.$store.getters.language;
              data.geo = { name: v.name };
              if (v.tr !== undefined && v.tr !== "") {
                data.geo = { name: v.tr[lang] };
              }
              this.save(data);
              this.close();
              return;
            })
            .catch((error: any) => {
              this.selfLoading = false;
              this.$notify({
                title: this.$t("notify.attention") as string,
                type: "error",
                message: this.$t("notify.error") as string
              });
              console.log(error);
              return;
            });
        })
        .catch((error: any) => {
          this.$notify({
            title: this.$t("notify.attention") as string,
            type: "error",
            message: this.$t("notify.error") as string
          });
          this.selfLoading = false;
          console.log(error);
        });
    });
  }
}
</script>

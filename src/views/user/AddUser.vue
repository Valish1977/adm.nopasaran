

<template>
  <div>
    <el-dialog
      :visible="isVisible && type == 'add'"
      width="1000px"
      top="5vh"
      @close="closeForm()"
      :close-on-click-modal="false"
    >
      <span slot="title" class="dialog-title">{{$t("User.addUserTitle")}}</span>
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
        label-width="250px"
        label-position="right"
        status-icon
        v-loading="isLoading || isSaving || selfLoading"
        :element-loading-text="$t('Access.loading')"
        element-loading-spinner="el-icon-loading"
      >
        <el-row>
          <el-col :span="24" class="form-container">
            <el-row :gutter="20">
              <el-form-item
                :label="$t('User.form.role_code.placeholder')"
                style="margin-bottom:0"
                required
              >
                <el-col :span="11">
                  <el-form-item
                    prop="role_code"
                    :rules="[
                            { required: true, message: $t('User.form.role_code.error'), trigger: 'change' }
                          ]"
                  >
                    <el-tooltip
                      :content="$t('User.form.role_code.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-select
                        style="width:100%"
                        v-model="myForm.role_code"
                        :placeholder="$t('User.form.role_code.placeholder')"
                        @change="modifyFn({ name: 'role_code', data: myForm.role_code })"
                      >
                        <el-option
                          v-for="item in references['ref_role']"
                          :key="item.code"
                          :value="item.code"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item prop="active">
                    <el-checkbox
                      style="width:100%"
                      v-model="myForm.active"
                      @change="modifyFn({name:'active', data: myForm.active})"
                    >{{$t('User.form.active.placeholder')}}</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item :label="$t('User.form.org_id.prefix')" style="margin-bottom:0" required>
                <el-col :span="11">
                  <el-form-item
                    prop="org_id"
                    :rules="[
                            { required: true, message: $t('User.form.org_id.error'), trigger: 'change' }
                          ]"
                  >
                    <el-tooltip
                      :content="$t('User.form.org_id.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-select
                        style="width:100%"
                        v-model="myForm.org_id"
                        :placeholder="$t('User.form.org_id.placeholder')"
                        filterable
                        @change="modifyFn({ name: 'org_id', data: myForm.org_id })"
                      >
                        <el-option
                          v-for="item in orgItems"
                          :key="item.id.toString()"
                          :value="item.id.toString()"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>

            <el-row :gutter="20">
              <el-form-item
                :label="$t('User.form.name.placeholder')"
                style="margin-bottom:0"
                required
              >
                <el-col :span="22">
                  <el-form-item
                    required
                    prop="name"
                    :rules="[ { required: true, message: $t('User.form.name.error'), trigger: 'change' },
                        { min: 1, max: 250, message: $t('User.form.name.error2'), trigger: ['blur', 'change'] } ]"
                  >
                    <el-tooltip
                      :content="$t('User.form.name.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('User.form.name.placeholder')"
                        v-model="myForm.name"
                        @input="modifyFn({name:'name', data: myForm.name})"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item :label="$t('User.form.email.prefix')" style="margin-bottom:0" required>
                <el-col :span="11">
                  <el-form-item
                    required
                    prop="email"
                    :rules="[ { required: true, message: $t('User.form.email.error'), trigger: 'change' },
                    { min: 1, max: 100, message: $t('User.form.email.error2'), trigger: ['blur', 'change'] } ]"
                  >
                    <el-tooltip
                      :content="$t('User.form.email.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('User.form.email.placeholder')"
                        v-model="myForm.email"
                        @input="modifyFn({name:'email', data: myForm.email})"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    required
                    prop="login"
                    :rules="[ 
                    { required: true, message: $t('User.form.login.error'), trigger: 'change' },
                    { min: 1, max: 100, message: $t('User.form.login.error2'), trigger: ['blur', 'change'] },
                    { validator: validateLogin, trigger: ['blur']} ]"
                  >
                    <el-tooltip
                      :content="$t('User.form.login.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('User.form.login.placeholder')"
                        v-model="myForm.login"
                        @input="modifyFn({name:'login', data: myForm.login})"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>

            <el-row :gutter="20">
              <el-form-item
                :label="$t('User.form.hash.placeholder')"
                style="margin-bottom:0"
                required
              >
                <el-col :span="11">
                  <el-form-item
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
                <el-col :span="11">
                  <el-form-item
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
import { ACTIONS, GETTERS, MUTATIONS } from "@/store/modules/userForm";
import { insertItem, searchDuplicateCard } from "@/api/user";
export type VForm = Vue & { validate: () => boolean };
@Component({
  computed: {
    ...mapState("userForm", ["isVisible", "isLoading", "isSaving", "type"]),
    ...mapState("reference", ["references"]),
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
export default class AddUser extends Vue {
  private selfForm: any;
  // validators
  private validateLogin: any;
  private validateHash: any;
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
    this.validateLogin = (rule, value, callback) => {
      if (value === undefined || value === null || value === "") {
        callback();
        return true;
      }
      searchDuplicateCard().then((data: any) => {
        if (data !== false) {
          if (data.length > 0) {
            this.alertText = this.$t("notify.dublicateLogin");
            callback(new Error(this.$t("User.form.login.error3") as string));
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
    this.validateHash = (rule, value, callback) => {
      if (value === undefined || value === null || value === "") {
        callback();
        return true;
      }
      if (this.myForm.hash !== this.myForm.hash2) {
        callback(new Error(this.$t("User.form.hash.error3") as string));
      } else {
        callback();
      }
    };
  }
  @Watch("myForm")
  private watchMyForm(): void {
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
  get orgItems() {
    return this.$store.getters["entities/org/all"]();
  }
  // life hook
  private beforeUpdate(): any {
    this.loadForm = false;
  }
  // life hook
  private updated() {
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
  private submitForm(): any {
    // проверка валидности формы
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
      searchDuplicateCard()
        .then((data: any) => {
          // проверка на наличие аналога записи
          if (data !== false) {
            if (data.length > 0) {
              this.$notify({
                title: this.$t("notify.attention") as string,
                type: "error",
                message: this.$t("notify.dublicateLogin") as string
              });
              throw new Error("dublicate login");
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
          insertItem()
            .then((data: any) => {
              this.$notify({
                title: this.$t("notify.success") as string,
                type: "success",
                message: this.$t("notify.successText1") as string
              });
              // сохраняем измененения в store и закрываем
              let v = this.orgItems.find((t: any) => t.id.toString() === this.myForm.org_id.toString());
              data.org = { name: v.name };

              v = this.references.ref_role.find(
                (t: any) => t.code === this.myForm.role_code
              );
              data.role = { name: v.name };
              this.save(data);
              this.close();
              return true;
            })
            .catch((error: any) => {
              this.selfLoading = false;
              this.$notify({
                title: this.$t("notify.attention") as string,
                type: "error",
                message: this.$t("notify.error") as string
              });
              console.log(error);
              return false;
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
          return false;
        });
    });
  }
}
</script>

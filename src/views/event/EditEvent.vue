

<template>
    <el-dialog
      fullscreen
      :visible="isVisible && type == 'edit'"
      @close="closeForm()"
    >
      <span slot="title" class="dialog-title">{{$t("Event.editEvent")}}</span>
      <div class="components-container">
      <el-alert
        style="margin-bottom:15px"
        v-if="alertText != '' "
        :title="alertText"
        type="warning"
        :closable="false"
        center
        show-icon
      ></el-alert>
      
        <el-row>
          <el-col :span="24" class="form-container">
            <el-steps :active="stepper" finish-status="success" align-center style="margin-bottom:50px">
                <el-step :title="$t('Event.base')"></el-step>
                <el-step :title="$t('Event.reports')"></el-step>
                <el-step :title="$t('Event.materials')"></el-step>
                <el-step :title="$t('Event.decor')"></el-step>
            </el-steps>

        <div v-show="stepper == 0">
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
            <el-row :gutter="20">
              <el-form-item :label="$t('Event.form.type_id.prefix')" style="margin-bottom:0" required>
                <el-col :span="11">
                  <el-form-item
                    prop="type_id"
                    :rules="[
                            { required: true, message: $t('Event.form.type_id.error'), trigger: 'change' }
                          ]"
                  >
                    <el-tooltip
                      :content="$t('Event.form.type_id.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-select
                        style="width:100%"
                        filterable
                        v-model="myForm.type_id"
                        :placeholder="$t('Event.form.type_id.placeholder')"
                        @change="modifyFn({name:'type_id', data: myForm.type_id})"
                      >
                        <el-option
                          v-for="item in references['ref_event_type']"
                          :key="item.id"
                          :value="item.id"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    prop="way_id"
                    :rules="[
                            { required: true, message: $t('Event.form.way_id.error'), trigger: 'change'}
                          ]"
                  >
                    <el-tooltip
                      :content="$t('Event.form.way_id.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-select
                        style="width:100%"
                        filterable
                        v-model="myForm.way_id"
                        :placeholder="$t('Event.form.way_id.placeholder')"
                        @change="modifyFn({name:'way_id', data: myForm.way_id})"
                      >
                        <el-option
                          v-for="item in references['ref_event_way']"
                          :key="item.id"
                          :value="item.id"
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
                :label="$t('Event.form.edate.prefix')"
                style="margin-bottom:0"
                required
              >
                <el-col :span="11">
                  <el-form-item
                    prop="edate"
                    :rules="[
                        { required: true, message: $t('Event.form.edate.error'), trigger: 'input' }
                      ]"
                  >
                    <el-tooltip
                      :content="$t('Event.form.edate.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-date-picker
                        style="width:100%"
                        v-model="myForm.edate"
                        type="datetime"
                        :picker-options="pickerOptions"
                        :placeholder="$t('Event.form.edate.placeholder')"
                        :format="$t('filters.components.CompDateTime.formatTemplate')"
                        :value-format="$t('filters.components.CompDateTime.formatTemplateValue')"
                        @input="modifyFn({name:'edate', data: myForm.edate})"
                      ></el-date-picker>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    prop="duration"
                  >
                    <el-tooltip
                      :content="$t('Event.form.duration.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input-number
                        :precision="0"
                        :step="1"
                        style="width:100%"
                        :placeholder="$t('Event.form.duration.placeholder')"
                        v-model="myForm.duration"
                        @change="modifyFn({ name: 'duration', data: myForm.duration})"
                      ></el-input-number>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item
                :label="$t('Event.form.geo_id.prefix')"
                style="margin-bottom:0"
                required
              >
              <el-col :span="11">
                  <el-form-item
                    prop="geo_id"
                    :rules="[
                            { required: true, message: $t('Event.form.geo_id.error'), trigger: 'change' }
                          ]"
                  >
                    <el-tooltip
                      :content="$t('Event.form.geo_id.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-select
                        style="width:100%"
                        filterable
                        v-model="myForm.geo_id"
                        :placeholder="$t('Event.form.geo_id.placeholder')"
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
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item
                required
                :label="$t('Event.form.adress.prefix')"
                style="margin-bottom:0"
              >
                <el-col :span="22">
                  <el-form-item
                    prop="adress"
                    :rules="[
                            { required: true, message: $t('Event.form.adress.error'), trigger: 'blur' }, 
                            { min: 1, max: 250, message: $t('Event.form.adress.error2'), trigger: ['blur', 'change'] }
                          ]"
                  >
                    <el-tooltip
                      :content="$t('Event.form.adress.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('Event.form.adress.placeholder')"
                        v-model="myForm.adress"
                        @input="modifyFn({name:'adress', data: myForm.adress})"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            <el-row :gutter="20">
              <el-form-item
                required
                :label="$t('Event.form.topic.prefix')"
                style="margin-bottom:0"
              >
                <el-col :span="22">
                  <el-form-item
                    prop="topic"
                    :rules="[
                            { required: true, message: $t('Event.form.topic.error'), trigger: 'blur' }, 
                            { min: 1, max: 250, message: $t('Event.form.topic.error2'), trigger: ['blur', 'change'] }
                          ]"
                  >
                    <el-tooltip
                      :content="$t('Event.form.topic.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('Event.form.topic.placeholder')"
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
                :label="$t('Event.form.descr.prefix')"
                style="margin-bottom:0"
              >
                <el-col :span="22">
                  <el-form-item
                    prop="descr"
                    :rules="[
                            { required: true, message: $t('Event.form.descr.error'), trigger: 'blur' }, 
                          ]"
                  >
                    <el-tooltip
                      :content="$t('Event.form.descr.placeholder')"
                      placement="top-end"
                      effect="light"
                      :open-delay="500"
                    >
                      <el-input
                        style="width:100%"
                        clearable
                        :placeholder="$t('Event.form.descr.placeholder')"
                        v-model="myForm.descr"
                        @input="modifyFn({name:'descr', data: myForm.descr})"
                      ></el-input>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-row>
            </el-form>
            </div>
            <div v-show="stepper == 1">
              <template v-for="(line, index) in contentList">
                <el-row :gutter="20" :key="index">
                  <el-col :span="24" :push="4" style="margin-left:20px"><h4>{{$t("Event.report")}} №{{index+1}} <el-button style="padding:0"  size="small" type="text" @click="delReport(index)">{{$t('Event.delReport')}}</el-button></h4></el-col>
                  <el-col :span="16">
                    <el-row>
                      <el-col :span="24">
                        <el-form ref="form" label-width="180px" label-position="right" status-icon>
                          <el-form-item :label="$t('Event.form.content.topic.prefix')" prop="descr">
                            <el-tooltip :content="$t('Event.form.content.topic.placeholder')" placement="top-end" effect="light">
                              <el-input clearable :placeholder="$t('Event.form.content.topic.placeholder')" style="width:100%" v-model="line.topic"></el-input>
                            </el-tooltip>
                          </el-form-item>
                        </el-form>
                      </el-col>
                      <el-col :span="24">
                        <el-form ref="form" label-width="180px" label-position="right" status-icon>
                          <el-form-item :label="$t('Event.form.content.descr.prefix')">
                            <el-tooltip :content="$t('Event.form.content.descr.placeholder')" placement="top-end" effect="light">
                              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" clearable :placeholder="$t('Event.form.content.descr.placeholder')" :maxlength="1000" v-model="line.descr"></el-input>
                            </el-tooltip>
                          </el-form-item>
                        </el-form>
                      </el-col>
                      <el-col :span="24">
                        <el-form ref="form" label-width="180px" label-position="right" status-icon>
                          <el-form-item :label="$t('Event.form.content.speaker.prefix')">
                            <el-tooltip :content="$t('Event.form.content.speaker.placeholder')" placement="top-end" effect="light">
                              <el-input clearable :placeholder="$t('Event.form.content.speaker.placeholder')" :maxlength="150" v-model="line.speaker"></el-input>
                            </el-tooltip>
                          </el-form-item>
                        </el-form>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="6">
                      <el-upload action class="upload-demo" list-type="picture" ref="uploadPhotos" :multiple="false" :limit="1" :auto-upload="false" :file-list="line.photo" :on-change="photoChange" :on-remove="handleRemovePhoto">
                        <el-button   size="small" @click.native="choiceUnixContent = line.unix" type="primary">{{$t('Event.form.content.addPhoto')}}</el-button>
                        <div slot="tip" class="el-upload__tip">{{$t('Event.form.content.uploadText')}}</div>
                      </el-upload>
                  </el-col>
                </el-row>
              </template>
              <el-row :gutter="20" >
                <el-col :span="6" :push="4" style="margin-left:20px"><el-button  size="small" type="text" @click="addReport()">{{$t('Event.addReport')}}</el-button></el-col>
              </el-row>
            </div>
            <div v-show="stepper == 2"> 
              
          <template v-for="(line, index) in materialList">
            <el-row :gutter="20" :key="index">
              <el-col :span="24" :push="4" style="margin-left:20px"><h4>{{$t("Event.material")}} №{{index+1}} <el-button style="padding:0"  size="small" type="text" @click="delMaterial(index)">{{$t('Event.delMaterial')}}</el-button></h4></el-col>
                  <el-col :span="13">
                    <el-form ref="form" label-width="180px" label-position="right" status-icon>
                      <el-form-item :label="$t('Event.form.material.author.prefix')">
                        <el-tooltip :content="$t('Event.form.material.author.placeholder')" placement="top-end" effect="light">
                          <el-input clearable :placeholder="$t('Event.form.material.author.placeholder')" v-model="line.author"></el-input>
                        </el-tooltip>
                      </el-form-item>
                    </el-form>
                  </el-col>
                  <el-col :span="9">
                    <el-form ref="form" label-position="right" status-icon>
                      <el-form-item>
                        <el-tooltip :content="$t('Event.form.material.link.placeholder')" placement="top-end" effect="light">
                          <el-input clearable :placeholder="$t('Event.form.material.link.placeholder')" :maxlength="150" v-model="line.link"></el-input>
                        </el-tooltip>
                      </el-form-item>
                    </el-form>
                  </el-col>
                  <el-col :span="22">
                    <el-form ref="form" label-width="180px" label-position="right" status-icon>
                      <el-form-item :label="$t('Event.form.material.name.prefix')">
                        <el-tooltip :content="$t('Event.form.material.name.placeholder')" placement="top-end" effect="light">
                          <el-input clearable :placeholder="$t('Event.form.material.name.placeholder')" :maxlength="150" v-model="line.name"></el-input>
                        </el-tooltip>
                      </el-form-item>
                    </el-form>
                  </el-col>
                </el-row>
            </template>
          <el-row :gutter="20" >
            <el-col :span="6" :push="4" style="margin-left:20px"><el-button  size="small" type="text" @click="addMaterial()">{{$t('Event.addMaterial')}}</el-button></el-col>
          </el-row>
        </div>
        <div v-show="stepper == 3">
          <el-row :gutter="20" type="flex" justify="space-around" style="margin-left:10px">
            <template v-for="(value, index) in themeList">
              <el-col :span="6" :key="index">
                <el-radio v-model="theme" :label="index" ><img width="150px" height="80px" :src="'/theme/'+value"/></el-radio>
              </el-col>
            </template>
          </el-row>
        </div>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between" style="margin-top:30px">
          <el-col :span="5">
            <p class="el-form-item__label" style="margin:0; padding:0">
              <span style="color:red">*</span>
              <span>{{$t("Access.requiredField")}}</span>
            </p>
          </el-col>
          <el-col :span="19" align="right">
            <el-button type="info" size="mini" plain @click.native="backStepper()" v-if="stepper != 0">{{$t("Event.back")}}</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              @click.native="saveData()"
              :disabled="isLoading || isSaving || selfLoading"
            >{{$t("Access.saved")}}</el-button>
            <el-button type="info" size="mini" plain @click.native="nextStepper()" v-if="stepper != 3">{{$t("Event.next")}}</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { DateTime } from "luxon";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { ACTIONS, GETTERS, MUTATIONS } from "@/store/modules/eventForm";
import { updateItem, uploadPhoto, delPhoto } from "@/api/event";
export type VForm = Vue & { validate: () => boolean };
@Component({
  methods: {
    ...mapActions("eventForm", {
      close: ACTIONS.CLOSE,
      save: ACTIONS.SAVE
    }),
    ...mapMutations("eventForm", {
      modify: MUTATIONS.MODIFY,
      remove: MUTATIONS.REMOVE,
      reset: MUTATIONS.RESET_CHANGES
    })
  },
  computed: {
    ...mapState("eventForm", ["isVisible", "isLoading", "isSaving", "type"]),
    ...mapState("reference", ["references"]),
    ...mapGetters("eventForm", {
      myForm: GETTERS.ITEMS,
      isChanged: GETTERS.IS_CHANGED
    }),
    selfForm(): VForm {
      return this.$refs.myForm as VForm;
    }
  }
})
export default class EditEvent extends Vue {
  private selfForm: any;
  // propertys
  private loadForm: any = false; // позволяет блокировать дублирующие изменения, в т.ч. при загрузке формы (критично!)
  private alertText: any = "";
  private dataLoaded: any = false; // загружены данные в форму или нет
  private selfLoading: any = true; //  загрузка в true чтобы скрыть сброс полей и загрузку полей (исключить дергание)
  private stepper: number = 0;
  private contentList: any = [];
  private materialList: any = [];
  private dialogPhoto: any = false;
  private photoList: any = []; // список файлов
  private delPhotoList: any = []; // удаляемые фото
  private countPhotos: any = 0; // кол-во загруженных фотографий
  private choiceUnixContent: any = ""; // переменная для хранения unixtime контента для привязки фото
  private theme: any = 0; // тема
  private themeList: any = [];
  private pickerOptions: any = {};
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

  // life hook vue
  private created(): void {
    this.pickerOptions = {
      shortcuts: [
        {
          text: this.$t("filters.components.CompDateTime.now"),
          onClick(picker) {
            picker.$emit("pick", new Date());
          }
        },
        {
          text: this.$t("filters.components.CompDateTime.tomorrow"),
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit("pick", date);
          }
        },
        {
          text: this.$t("filters.components.CompDateTime.weekLater"),
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit("pick", date);
          }
        }
      ]
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
      this.setDataForm();
      setTimeout(() => {
        this.selfLoading = false;
      }, 500);
    }
  }
  @Watch("theme")
  private watchTheme(): void {
    this.modify({
      name: "tplparam",
      data: this.references.ref_event_way[this.theme].tplparam
    });
  }
  // life hook vue
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
    this.setDataForm();
    this.selfForm.resetFields();
    this.alertText = "";
  }
  private closeForm(): void {
    this.close();
    this.selfLoading = true;
    this.dataLoaded = false;
  }
  private nextStepper(): void {
    if (this.stepper++ > 3) {
      this.stepper = 3;
    }
  }
  private backStepper(): void {
    if (this.stepper-- < 0) {
      this.stepper = 0;
    }
  }
  private setDataForm(): void {
    this.delPhotoList = [];
    this.photoList = []; // затираем фотки
    this.countPhotos = 0;
    this.contentList = [];
    for (const i in this.myForm.econtent) {
      if (this.myForm.econtent[i] !== undefined) {
        this.addReport(
          this.myForm.econtent[i].topic,
          this.myForm.econtent[i].descr,
          this.myForm.econtent[i].speaker,
          [
            {
              unix: this.myForm.econtent[i].index,
              name: this.myForm.econtent[i].photoName,
              alias: this.myForm.econtent[i].photoAlias,
              percentage: 100,
              status: "success",
              uid: this.myForm.econtent[i].index,
              unixContent: this.myForm.econtent[i].index,
              url: "/r/x600/" + this.myForm.econtent[i].photoAlias,
              response: [this.myForm.econtent[i].photoAlias]
            }
          ] as any,
          this.myForm.econtent[i].index
        );
      }
    }
    this.materialList = [];
    for (const i in this.myForm.ematerials) {
      if (this.myForm.ematerials[i] !== undefined) {
        this.addMaterial(
          this.myForm.ematerials[i].author,
          this.myForm.ematerials[i].link,
          this.myForm.ematerials[i].name
        );
      }
    }
    this.choiceUnixContent = ""; // переменная для хранения unixtime контента для привязки фото
    this.stepper = 0;
    const v = this.references.ref_event_way.find(
      (t: any) => t.id === this.myForm.way_id
    );
    const f = this.references.ref_event_way.find(
      (t: any) =>
        t.tplparam.event.topBackground ===
        this.myForm.tplparam.event.topBackground
    );
    this.theme = f.id - 1;
    this.themeList = [];
    for (const n in this.references.ref_event_way) {
      if (this.references.ref_event_way[n] !== undefined) {
        this.themeList.push(
          this.references.ref_event_way[n].tplparam.event.topBackground
        );
      }
    }
  }
  private addMaterial(author = "", link = "", name = ""): void {
    this.materialList.push({ author, link, name });
  }
  private delMaterial(index): void {
    const materialList: any = [];
    for (const i in this.materialList) {
      if (i !== index) {
        materialList.push({
          author: this.materialList[i].author,
          link: this.materialList[i].link,
          name: this.materialList[i].name
        });
      }
    }
    this.materialList = [];
    for (const i in materialList) {
      if (materialList[i] !== undefined) {
        this.materialList.push(Object.assign({}, materialList[i]));
      }
    }
  }
  private addReport(
    topic = "",
    descr = "",
    speaker = "",
    photo = [],
    unix = DateTime.local().ts
  ): void {
    this.contentList.push({topic, descr, speaker, photo, unix});
    if (photo[0] !== undefined) {
      this.photoList.push(Object.assign({}, photo[0]));
    }
  }
  private delReport(index): void {
    if (this.contentList[index].photo.length > 0) {
      this.delPhotoFn(this.contentList[index].unix);
    }
    const contentList: any = [];
    for (const i in this.contentList) {
      if (i !== index) {
        contentList.push({
          topic: this.contentList[i].topic,
          descr: this.contentList[i].descr,
          speaker: this.contentList[i].speaker,
          photo: [],
          unix: this.contentList[i].unix
        });
      }
    }
    this.contentList = [];
    for (const i in contentList) {
      if (this.contentList[i] !== undefined) {
        this.contentList.push(Object.assign({}, contentList[i]));
      }
    }
    for (const n in this.photoList) {
      if (this.photoList[n].unixContent !== undefined) {
        for (const i in this.contentList) {
          if (this.contentList[i].unix === this.photoList[n].unixContent) {
            this.contentList[i].photo[0] = Object.assign(
              {},
              this.photoList[n]
            );
          }
        }
      }
    }
  }
  private handleRemovePhoto(file, fileList): void {
    this.delPhotoFn(file.unixContent);
  }
  private delPhotoFn(index): void {
    // создаем новый массив и наполняем объектами фотографий, исключая удаленный
    const files: any = [];
    for (const v in this.photoList) {
      if (this.photoList[v].unixContent === index) {
        for (const i in this.contentList) {
          if (this.contentList[i].unix === index) {
            if (
              this.contentList[i].photo[0] !== undefined &&
              this.contentList[i].photo[0].status === "success"
            ) {
              this.delPhotoList.push(this.contentList[i].photo[0].alias);
            }
            this.contentList[i].photo = [];
          }
        }
      } else {
        files.push(Object.assign({}, this.photoList[v]));
      }
    }
    // зачищаем список файлов и наполняем с созданного массива
    this.photoList = [];
    for (const v in files) {
      if (files[v] !== undefined) {
        this.photoList.push(Object.assign({}, files[v]));
      }
    }
    // передаем ссылки на файлы в компоненты контента
    for (const v in this.photoList) {
      if (this.photoList[v].unixContent !== undefined) {
        for (const i in this.contentList) {
          if (this.contentList[i].unix === this.photoList[v].unixContent) {
            this.contentList[i].photo[0] = Object.assign({}, this.photoList[v]);
          }
        }
      }
    }
  }
  private photoChange(file, photoList): void {
    const isJPG = file.raw.type === "image/jpeg";
    if (!isJPG) {
      this.$notify({
        title: this.$t("notify.attention") as string,
        type: "error",
        message: this.$t("notify.noImage") as string
      });
    } else {
      file.unixContent = this.choiceUnixContent;
      this.photoList.push(Object.assign({}, file));
      for (const v in this.photoList) {
        if (this.photoList[v].unixContent === this.choiceUnixContent) {
          for (const i in this.contentList) {
            if (this.contentList[i].unix === this.choiceUnixContent) {
              this.contentList[i].photo[0] = this.photoList[v];
            }
          }
        }
      }
    }
  }
  private uploads(): any {
    return new Promise((resolve, reject) => {
      for (const n in this.photoList) {
        if (this.photoList[n].status === "ready") {
          this.photoList[n].response = [];
          const arr: any = this.photoList[n].name.split(".");
          this.photoList[n].response[0] =
            "img/" +
            this.cyrb53(this.photoList[n].name) +
            "." +
            arr[arr.length - 1];
          this.countPhotos++;
        }
      }
      const photos: any = this.countPhotos > 0 ? this.photoList : [];
      if (this.countPhotos > 0 || this.delPhotoList.length > 0) {
        delPhoto(this.delPhotoList)
          .then(() => uploadPhoto(photos))
          .then(() => {
            for (const n in this.photoList) {
              if (this.photoList[n].status === "ready") {
                this.photoList[n].status = "success";
                this.photoList[n].percentage = 100;
                for (const i in this.contentList) {
                  if (
                    this.contentList[i].unix === this.photoList[n].unixContent
                  ) {
                    this.contentList[i].photo[0].name = this.photoList[n].name;
                    this.contentList[i].photo[0].alias = this.photoList[n].response[0];
                  }
                }
                this.countPhotos--;
              }
            }
            resolve(true);
          })
          .catch((error: any) => {
            reject(error);
          });
      } else {
        resolve(true);
      }
    });
  }
  private saveData(): any {
    this.selfForm.validate((valid: boolean) => {
      // проверка валидности формы
      if (!valid) {
        this.$notify({
          title: this.$t("notify.attention") as string,
          type: "warning",
          message: this.$t("notify.errorData") as string
        });
      }
      this.selfLoading = true;
      this.uploads()
        .then(() => {
          const content: any = [];
          if (this.contentList.length > 0) {
            for (const v of this.contentList) {
              content.push({
                descr: v.descr,
                topic: v.topic,
                speaker: v.speaker,
                index: v.unix,
                photoName: v.photo.length > 0 ? v.photo[0].name : "",
                photoAlias: v.photo.length > 0 ? v.photo[0].alias : ""
              });
            }
          }
          this.modify({ name: "econtent", data: content });
          this.modify({ name: "ematerials", data: this.materialList });
        })
        .then(() => updateItem())
        .then((data: any) => {
          this.$notify({
            title: this.$t("notify.success") as string,
            type: "success",
            message: this.$t("notify.successText1") as string
          });
          let v = this.references.ref_event_way.find(
            (t: any) => t.id === this.myForm.way_id
          );
          data.way = { name: v.name };
          v = this.references.ref_geo.find((t: any) => t.id === this.myForm.geo_id);
          data.geo = { name: v.name };
          v = this.references.ref_event_type.find(
            (t: any) => t.id === this.myForm.type_id
          );
          data.type = { name: v.name };
          // сохраняем измененения в store и закрываем
          this.save(data);
          this.resetForm(); // сброс в store и формы
          this.close();
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
  private cyrb53(str, seed = Math.floor(Date.now() / 1000)): any {
    // tslint:disable-next-line:no-bitwise
    let h1: any  = 0xdeadbeef ^ seed;
    // tslint:disable-next-line:no-bitwise
    let h2: any = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      // tslint:disable-next-line:no-bitwise
      h1 = Math.imul(h1 ^ ch, 2654435761);
      // tslint:disable-next-line:no-bitwise
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    // tslint:disable-next-line:no-bitwise
    h1 =
    // tslint:disable-next-line:no-bitwise
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    // tslint:disable-next-line:no-bitwise
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      // tslint:disable-next-line:no-bitwise
    h2 =
    // tslint:disable-next-line:no-bitwise
    Math.imul(h2 ^ (h2 >>> 16), 2246822507)
    // tslint:disable-next-line:no-bitwise
    ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      // tslint:disable-next-line:no-bitwise
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
}
</script>

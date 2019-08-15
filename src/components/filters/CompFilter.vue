<template>
  <el-row>
    <el-col :span="24"></el-col>
    <el-col :span="24">
      <el-row style="margin:10px 0 20px 0">
        <el-col :span="22">
          <span v-if="arrView.length == 0">&nbsp;</span>
          <span v-else class="str-view">
            <span class="first-text">{{$t('filters.conditionFilter')}}</span>
            <span class="first-text" v-for="(v, index)  in arrView" :key="index">
              <span class="operation" v-if="index != 0">{{$t(v.operation)}}</span>
              <el-tag>{{v.title}} {{$t(v.condition)}} {{v.value}}</el-tag>
            </span>
            (
            <a @click="clearConditions()" class="blue-text">{{$t('filters.reset')}}</a> )
          </span>
        </el-col>
        <el-col :span="2" style="text-align:right">
          <el-popover placement="bottom-start" width="800" v-model="menuTemplate">
            <div
              v-loading="isLoading"
              :element-loading-text="$t('filters.loading')"
              element-loading-spinner="el-icon-loading"
            >
              <el-row style="padding-bottom:10px">
                <el-col :span="22">
                  <span class="black-text">{{$t('filters.conditionSearch')}}</span>
                </el-col>
                <el-col :span="2">
                  <div @click="menuTemplate = false" style="cursor:pointer; text-align:right;">
                    <font-awesome-icon icon="times" />
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="3" style="text-align:center">
                  <span v-if="selfConditions.length > 0">{{$t('filters.operation')}}</span>
                </el-col>
                <el-col :span="7" style="text-align:center">
                  <span v-if="selfConditions.length > 0">{{$t('filters.nameField')}}</span>
                </el-col>
                <el-col :span="5" style="text-align:center">
                  <span v-if="selfConditions.length > 0">{{$t('filters.condition')}}</span>
                </el-col>
                <el-col :span="8" style="text-align:center">
                  <span v-if="selfConditions.length > 0">{{$t('filters.value')}}</span>
                </el-col>
              </el-row>

              <el-row
                :gutter="20"
                v-for="(line, indexCondition) in this.selfConditions"
                :key="indexCondition"
                style="margin:10px 0"
              >
                <el-col :span="3">
                  <el-select
                    v-show="indexCondition > 0"
                    v-model="line.operation"
                    @change="changeField(indexCondition, 'operation', line.operation)"
                  >
                    <el-option value="and" :label="$t('filters.operations.and')"></el-option>
                    <el-option value="or" :label="$t('filters.operations.or')"></el-option>
                  </el-select>
                  <span v-show="indexCondition == 0">&nbsp;</span>
                </el-col>
                <el-col :span="7">
                  <el-select
                    v-model="line.filter"
                    @change="changeField(indexCondition, 'filter', line.filter), line.component = model[line.filter].component"
                    :placeholder="$t('filters.selectFilter')"
                    style="width:100%"
                  >
                    <el-option-group
                      v-for="itemg in filterGroupList"
                      :key="itemg.key"
                      :label="itemg.text"
                    >
                      <el-option
                        v-for="item in filterListFn(itemg.key)"
                        :key="item.key"
                        :selected="item.select"
                        :label="item.text"
                        :value="item.key"
                      ></el-option>
                    </el-option-group>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-select
                    style="width:100%"
                    v-model="line.condition"
                    @change="changeField(indexCondition, 'condition', line.condition)"
                  >
                    <el-option
                      v-for="(item, indexConditionList) in conditionListFn(line)"
                      :key="indexConditionList"
                      :value="item.name"
                      :label="item.label"
                      :selected="item.selected"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <component
                    @getDataField="changeField"
                    @beforeMount="setConditionValue"
                    @beforeUpdate="setConditionValue"
                    :is="line.component"
                    :setValue="line.value"
                    :setIndex="indexCondition"
                    :setParam="line.compParam"
                  ></component>
                </el-col>
                <el-col :span="1">
                  <div
                    @click="removeCondition(indexCondition)"
                    style="cursor:pointer; text-align:right; padding-top:2px"
                  >
                    <font-awesome-icon icon="times" style="margin-top:5px" />
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="20" style="margin:10px 0">
                <el-col :span="20">
                  <a class="blue-text" @click="addCondition(null)">{{$t('filters.addCondition')}}</a>
                </el-col>
                <el-col :span="4" style="padding-left:5px">
                  <el-button
                    icon="el-icon-search"
                    type="primary"
                    size="small"
                    plain
                    @click="search()"
                  >{{$t('filters.search')}}</el-button>
                </el-col>
              </el-row>

              <el-row
                :gutter="20"
                style="margin:10px 0; padding-top:10px; border-top:1px solid #ccc"
              >
                <el-col :span="22">
                  <a
                    @click="openTemplateList = !openTemplateList"
                    class="blue-text"
                  >{{openTemplateList ? $t('filters.hide') : $t('filters.workTemplate')}}</a>
                </el-col>
              </el-row>

              <el-row :gutter="20" style="margin:10px 0" v-show="openTemplateList">
                <el-col :span="24">
                  <el-row style="margin-bottom:10px">
                    <el-col :span="23">
                      <el-input
                        :placeholder="$t('filters.setNameTemplate')"
                        v-model="addTempTextField"
                      ></el-input>
                    </el-col>
                    <el-col :span="1">
                      <div
                        @click="setTemplateFn(addTempTextField)"
                        style="cursor:pointer; text-align:right; margin-top:6px"
                      >
                        <font-awesome-icon icon="save" />
                      </div>
                    </el-col>
                  </el-row>
                  <el-row v-for="(item, index) in filters" :key="index" style="padding-bottom:5px">
                    <el-col :span="23">
                      <a
                        @click="selectTemplateFn(index)"
                        :class="(radioTemplate == index && radioTemplate !== false) ? 'blue-text' : 'black-text'"
                      >{{item.name}}</a>
                    </el-col>
                    <el-col :span="1">
                      <div
                        @click="delTemplate(index)"
                        style="cursor:pointer; text-align:right; padding-top:2px"
                      >
                        <font-awesome-icon icon="times" />
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <el-button
              v-if="arrView.length == 0"
              slot="reference"
              icon="el-icon-search"
              circle
              type="primary"
              size="small"
              plain
              style="margin-top:-4px"
            ></el-button>
            <el-button
              v-else
              slot="reference"
              circle
              type="primary"
              size="small"
              plain
              style="margin-top:-4px"
            >
              <font-awesome-icon icon="pen" />
            </el-button>
          </el-popover>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script lang='ts'>
import { mapState, mapActions, mapGetters } from "vuex";
import { ACTIONS, GETTERS } from "@/store/modules/filters";
import CompInput from "@/components/filters/CompInput.vue";
import CompNumber from "@/components/filters/CompNumber.vue";
import CompDate from "@/components/filters/CompDate.vue";
import CompSelect from "@/components/filters/CompSelect.vue";
import CompBool from "@/components/filters/CompBool.vue";
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
@Component({
  components: {
    CompInput,
    CompNumber,
    CompDate,
    CompSelect,
    CompBool
  },
  computed: {
    ...mapState("filters", [
      "useFilter",
      "conditions",
      "filters",
      "model",
      "isLoading",
      "quickSearch"
    ]),
    ...mapGetters("filters", {
      arrView: GETTERS.ARR_VIEW
    })
  },
  methods: {
    ...mapActions("filters", {
      setConditions: ACTIONS.SET_CONDITIONS, // перезаписывает условия набираемого фильтра в stor
      setTemplate: ACTIONS.SET_TEMPLATE, // созраняет набранные условия как шаблон
      delTemplate: ACTIONS.DEL_TEMPLATE, // удаляет шаблон
      selectTemplate: ACTIONS.SELECT_TEMPLATE, // удаляет шаблон
      search: ACTIONS.SET_USE_FILTER // запрос на поиск
    })
  }
})
export default class CompFilter extends Vue {
  private selfConditions: any = [];
  private defaultCondition: any = {
    operation: "and",
    condition: null,
    filter: "",
    component: "",
    compParam: "",
    value: ""
  }; // условие по по умолчанию при добавлении
  private openTemplateList: any = false;
  private filterList: any = [];
  private filterGroupList: any = [];
  private menuTemplate: any = false;
  private radioTemplate: any = false;
  private addTempTextField: any = "";
  private conditionLoaded: any = []; // список отслеживаемых в загрузке компонентов (полей фильтров)
  private filterIndex: any = null; // index выбранного фильтра
  private components: any = {
    // создаем массив фильтров для генерации ответа на лету без загрузки компонентов в DOM (использование в цикле)
    CompInput,
    CompNumber,
    CompDate,
    CompSelect,
    CompBool
  };
  private componentConditions: any = {
    CompInput: [0, 5, 7, 8, 9], // ключи из conditionList
    CompNumber: [0, 1, 2, 3, 4, 5],
    CompDate: [0, 1, 2, 3, 4, 5],
    CompSelect: [0, 5],
    CompBool: [6]
  };
  private conditionList: any;
  // ...maps vuex (actions)
  private setConditions: any; // перезаписывает условия набираемого фильтра в stor
  private setTemplate: any; // созраняет набранные условия как шаблон
  private delTemplate: any; // удаляет шаблон
  private selectTemplate: any; // удаляет шаблон
  private search: any; // запрос на поиск
  // ...maps vuex (getters)
  private arrView;
  // ...maps vuex (state)
  private useFilter: any;
  private conditions: any;
  private filters: any;
  private model: any;
  private isLoading: any;
  private quickSearch: any;

  constructor() {
    super();
  }
  private created(): void {
    this.conditionList = [
      { name: "eq", label: this.$t("filters.conditions.eq") },
      { name: "gt", label: this.$t("filters.conditions.gt") },
      { name: "gte", label: this.$t("filters.conditions.gte") },
      { name: "lt", label: this.$t("filters.conditions.lt") },
      { name: "lte", label: this.$t("filters.conditions.lte") },
      { name: "neq", label: this.$t("filters.conditions.neq") },
      { name: "is", label: this.$t("filters.conditions.is") }, // проверка на точное равенство (null,true,false)
      { name: "ilike", label: this.$t("filters.conditions.ilike") },
      { name: "ilike*", label: this.$t("filters.conditions.ilike*") },
      { name: "*ilike", label: this.$t("filters.conditions.*ilike") }
    ];
  }
  @Watch("quickSearch")
  private watchQuickSearch(): void {
    if (this.conditions.length > 0) {
      this.filterIndex = null;
      this.selfConditions = [];
      for (const v in this.conditions) {
        if (this.conditions[v] !== undefined) {
          const cond: any = Object.assign({}, this.conditions[v]);
          this.selfConditions.push({
            operation: cond.operation,
            condition: cond.condition,
            filter: cond.filter,
            component: cond.component,
            value: cond.value,
            compParam: this.model[cond.filter].params
          });
        }
      }
      this.search();
    }
  }
  @Watch("menuTemplate")
  private watchMenuTemplate(): void {
    // формируется сборка фильтров при запросе фильтрации с другого роута
    if (this.selfConditions[0].value === null) {
      this.selfConditions[0].value = undefined;
    }
    if (
      this.menuTemplate &&
      this.conditions.length > 0 &&
      this.selfConditions.length === 1 &&
      this.selfConditions[0].value ===
        this.model[this.selfConditions[0].filter].value
    ) {
      this.selfConditions = [];
      this.conditionLoaded = [];
      for (const v of this.conditions) {
        this.conditionLoaded.push({
          value: v.value,
          component: v.component,
          loaded: false
        });
        this.addCondition(v);
      }
    }
  }
  private mounted(): void {
    for (const v in this.model) {
      // формируем по умолчанию добавляемый элемент поиска из первого в переданной модели
      if (this.model[v].component !== undefined) {
        this.defaultCondition.filter = v;
        if (this.model[v].value !== undefined) {
          this.defaultCondition.value = this.model[v].value;
        } else {
          this.defaultCondition.value = undefined;
        }
        this.defaultCondition.component = this.model[v].component;
        this.defaultCondition.compParam = this.model[v].params;
        this.defaultCondition.condition = this.conditionList[
          this.componentConditions[this.model[v].component][0]
        ].name;
        break;
      }
    }

    for (const v in this.model) {
      if (this.model[v] !== undefined) {
        if (this.model[v].header !== undefined) {
          // создаем массив групп фильтров
          this.filterGroupList.push({
            text: this.model[v].header,
            key: this.model[v].group_id
          });
        }
        this.filterList.push(this.model[v]);
        // задаем значения по умолчанию если default === true
        if (this.model[v].default) {
          this.defaultCondition.filter = v;
          if (this.model[v].value !== undefined) {
            this.defaultCondition.value = this.model[v].value;
          } else {
            this.defaultCondition.value = undefined;
          }
          this.defaultCondition.component = this.model[v].component;
          this.defaultCondition.compParam = this.model[v].params;
          // tslint:disable-next-line:max-line-length
          this.defaultCondition.condition = this.conditionList[this.componentConditions[this.model[v].component][0]].name;
        }
      }
    }
    this.selfConditions = [Object.assign({}, this.defaultCondition)];
  }

  private filterListFn(v: any, name: any): any {
    const items: any = [];
    for (const item of this.filterList) {
      if (item.group_id === v && item.component) {
        const n: any = Object.assign({}, item);
        n.select = false;
        if (name === n.key) {
          n.select = true;
        }
        items.push(n);
      }
    }
    return items;
  }
  private conditionListFn(item: any): any {
    const arr: any = [];
    let i: number = 0;
    for (const v of this.componentConditions[item.component]) {
      const obj = Object.assign({}, this.conditionList[v]);
      obj.selected = false;
      if (i === 0 || item.condition === obj.name) {
        obj.selected = true;
      }
      arr.push(obj);
      i++;
    }
    return arr;
  }
  private addCondition(condition: any): void {
    if (condition === null) {
      this.filterIndex = null;
      this.selfConditions.push(Object.assign({}, this.defaultCondition));
    } else if (condition.component !== undefined) {
      const cond = Object.assign({}, condition);
      cond.compParam = this.model[cond.filter].params;
      if (cond.value === undefined) {
        if (this.model[cond.filter].value !== undefined) {
          cond.value = this.model[cond.filter].value;
        } else {
          cond.value = null;
        }
      }
      this.selfConditions.push(Object.assign({}, cond));
    }
  }
  // удаление описаний страница проперти
  private removeCondition(index: any): void {
    this.filterIndex = null;
    this.selfConditions.splice(index, 1);
    this.modifyConditions();
  }
  private clearConditions(): void {
    this.filterIndex = null;
    this.selfConditions = [Object.assign({}, this.defaultCondition)];
    this.selfConditions[0].value = undefined;
    this.modifyConditions();
    this.search();
  }
  private selectTemplateFn(index: any): void {
    this.filterIndex = index;
    this.selectTemplate(index);
    this.radioTemplate = index;
    this.selfConditions = [];
    this.conditionLoaded = [];
    for (const v of this.filters[index].code) {
      this.conditionLoaded.push({
        value: v.value,
        component: v.component,
        loaded: false
      });
      this.addCondition(v);
    }
  }
  private setConditionValue(index): void {
    let count = 0;
    if (
      this.conditions.length > 0 &&
      this.useFilter.length > 0 &&
      this.conditionLoaded.length !== 0 &&
      this.filterIndex === null
    ) {
      // наполняем значениями когда запрос на фильтрацию пришел с другого роута
      for (const n in this.conditionLoaded) {
        if (this.conditionLoaded[n].loaded === false) {
          if (n === index) {
            this.selfConditions[n].value = this.conditions[n].value;
            this.conditionLoaded[n].loaded = true;
          } else {
            count++;
          }
        }
      }
      if (count === 0) {
        this.conditionLoaded = [];
      }
    }
    if (this.conditionLoaded.length === 0 || this.filterIndex === null) {
      return;
    }
    // далее отрабатывает в случае если фильтр выбран из готовых
    for (const n in this.conditionLoaded) {
      if (this.conditionLoaded[n].loaded === false) {
        if (n === index) {
          this.selfConditions[n].value = this.filters[this.filterIndex].code[
            n
          ].value;
          this.conditionLoaded[n].loaded = true;
        } else {
          count++;
        }
      }
    }
    if (count === 0) {
      this.conditionLoaded = [];
    }
  }
  private changeField(index, name: any = null, value: any = null): void {
    if (typeof index === "object") {
      const copyObj = Object.assign({}, index);
      index = copyObj.index;
      name = "value";
      value = copyObj.value;
    }
    this.selfConditions[index][name] = value;
    if (name === "filter") {
      if (this.model[value].value !== undefined) {
        this.selfConditions[index].value = this.model[value].value;
      } else {
        this.selfConditions[index].value = undefined;
      }
      this.selfConditions[index].compParam = this.model[value].params;
      this.selfConditions[index].component = this.model[value].component;
      this.selfConditions[index].condition = this.conditionList[
        this.componentConditions[this.model[value].component][0]
      ].name;
    }
    if (this.menuTemplate) {
      this.modifyConditions();
    }
  }
  private modifyConditions(): void {
    // формируем массив условий в стор
    const arr: any = [];
    for (const v of this.selfConditions) {
      if (
        v.condition !== null &&
        v.value !== "" &&
        v.value !== undefined &&
        v.value !== null
      ) {
        arr.push({
          operation: v.operation,
          condition: v.condition,
          filter: v.filter,
          component: v.component,
          value: v.value
        });
      }
    }
    this.setConditions(arr);
  }
  private async setTemplateFn(fieldName) {
    if (fieldName === "") {
      this.$notify({
        title: this.$t("filters.notify.warning") as string,
        type: "warning",
        dangerouslyUseHTMLString: true,
        message: this.$t("filters.notify.text") as string
      });
      return false;
    }
    for (const v of this.filters) {
      if (v.name === fieldName) {
        this.$notify({
          title: this.$t("filters.notify.warning") as string,
          type: "warning",
          dangerouslyUseHTMLString: true,
          message: this.$t("filters.notify.text1") as string
        });
        return false;
      }
    }
    await this.setTemplate(fieldName);
    for (const v in this.filters) {
      if (this.filters[v].name === fieldName) {
        this.radioTemplate = v; // делаем выделенным добавленный фильтр
      }
    }
  }
}

/*
        имя объекта 'name':{} задается с тем учетом, что данное имя будет отправлено
        на сервер как имя компонента с данными
        component: наименование компонента;
        group_id: id группы селекта;
        text: наименование в option;
        query: данные формирующие запрос по умолчанию
        default: при true выбирает фильтр по умолчанию
        query.value: значение выбранного фильтра по умолчанию (добавляется в формируемом запросе на сервер)
        query.name:  значение выбранного фильтра по умолчанию (добавляется в выводимую строку поиска)
        params{}: объект с параметрами отправляемый непосредственно в компонент фильтра, для его настройки
        params.textView (строка как префикс к результату),
        quickSearch: при наличии переменной поле участвует в быстром поиске. condition:
        указывает какой запрос будет применен (Использовать только для component:
        'CompInput' или 'CompNumber' )
        */

/*
  filterModel: {
        header_all: { header: 'Общие сведения', group_id: 1 },
        car_num: {
          component: 'CompInput',
          group_id: 1,
          text: 'Номер карты',
          params: {
            textView: 'Номер карты',
            placeholder:'Укажите номер карты',
          },
          quickSearch: {
            condition: 'ilike*'
          }
        },
        header_test: { header: 'Дополнительно', group_id: 2 },
        doc_date: {
          component: 'CompDate',
          group_id: 2,
          text: 'дата документа',
          default: true,
          params: {
            textView: 'дата документа',
            placeholder:'Укажите дату документа',
          },
          query: {
            condition: "gte",
            operation: "and",
            value: DateTime.local()
              .minus(604800000)
              .toISODate(),
            name: DateTime.local()
              .minus(604800000)
              .toLocaleString(),
          } // 60*60*24*7*1000
        },
        number: {
          component: 'CompNumber',
          group_id: 2,
          text: 'кол-во',
          value: 25,
          params: {
            textView: 'кол-во',
            placeholder:'Укажите кол-во',
            min: 7,
            max: 30,
            precision:2,
            step:0.1
          }
        },
        select: {
          component: 'CompSelect',
          group_id: 2,
          text: 'Выберите роль',
          params: {
            textView: 'Тип',
            placeholder:'Выберите роль',
            reference: 'ref_role',
            key: 'code'
          },
          query: { condition: 'eq', operation: 'and', value: 'adm' }
        },
        select2: {
          component: 'CompSelect',
          group_id: 2,
          text: 'Выберите язык',
          params: {
            textView: 'Язык',
            placeholder:'Выберите язык',
            reference: [
              {id:1, name:'Русский'},
              {id:2, name:'Английский'},
              {id:3, name:'Испанский'},
            ],
            key: 'id'
          }
        },
        bool: {
          component: 'CompBool',
          group_id: 2,
          text: 'Выбор сделан',
          params: {
            textView: 'Выбор сделан',
            placeholder:'Выбор сделан',
            reference: [
              {id:1, name: this.$t('filters.components.CompBool.true')},
              {id:2, name: this.$t('filters.components.CompBool.false')},
            ]
          }
        }
      }
*/
/*
формирование внешнего запроса на фильтр
Template часть: <a  @click='setFilter()' >Тестовый фильтр</a>
JS часть: setFilter(){
      this.requestFilter( [{filter: 'sname', condition: 'neq', operation: 'and', value: 'sds' },
      {filter: 'sname', condition: 'ilike*', operation: 'and', value: 'www' },
      {filter: 'inn', condition: 'ilike', operation: 'and', value: '123' },
      {filter: 'active', condition: 'is', operation: 'or', value: true }] )
      this.$router.push({ path: '/adm/org' })
} */

/* ...mapActions('filters', { // условие для подключения запроса с другого роута
      requestFilter: ACTIONS.SET_REQUEST_FILTER, // перезаписывает условия набираемого фильтра в stor
    }),// tslint:disable-next-line:max-line-length
    setFilter(){ // условие для подключения запроса с другого роута
    (name используется для прямой записи названия, ипользуется для обхода
    запроса в reference при формировании справочников пользовательской функцией)
      this.requestFilter( [ {filter: 'select', condition: 'neq', operation: 'and', value: 1 },
      {filter: 'opi_type_id', condition: 'eq', operation: 'and', value: 2 },
      {filter: 'from_stock_id', condition: 'eq', operation: 'and', value: 2, name:'Карьер 6' }] )
      this.$router.push({ path: '/cl/sale' })
    }, */
</script>
<style scoped>
.blue-text {
  color: #409eff;
}
.black-text {
  color: #303133;
}
.str-view {
  font-size: 14px;
}
.str-view .operation {
  color: red;
}
</style>


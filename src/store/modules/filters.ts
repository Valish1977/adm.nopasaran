import Vue from "vue";
import { getPrefs, updatePrefs } from "@/api/filters";
/*
 * Public
 */
export const GETTERS = {
    STR_QUERY: "STR_QUERY", // возвращает строку фильтра для формирования запроса
    // возвращает строку фильтра для отображения в компоненте (для показа пользователю в читабельном виде)
    ARR_VIEW: "ARR_VIEW"
};
export const ACTIONS = {
    SET_MODEL: "SET_MODEL",
    SET_CONDITIONS: "SET_CONDITIONS",
    SET_TEMPLATE: "SET_TEMPLATE",
    DEL_TEMPLATE: "DEL_TEMPLATE",
    SELECT_TEMPLATE: "SELECT_TEMPLATE",
    SET_REQUEST_FILTER: "SET_REQUEST_FILTER",
    SET_USE_FILTER: "SET_USE_FILTER",
    SET_QUICK_SEARCH: "SET_QUICK_SEARCH" // ставим отметку что прошли изменения в быстром поиске
};
/*
 * Private mutations
 */
const SET_REQUEST_FILTER = "P__SET_REQUEST_FILTER";
const SET_MODEL = "P__SET_MODEL";
const SET_FILTERS = "P__SET_FILTERS";
const SET_PREFS = "P__SET_PREFS";
const SET_CONDITIONS = "P__SET_CONDITIONS";
const SET_TEMPLATE = "P__SET_TEMPLATE";
const DEL_TEMPLATE = "P__DEL_TEMPLATE";
const SET_PAGE_NAME = "P__SET_PAGE_NAME";
const SET_LOADING = "P__SET_LOADING";
const SET_USE_FILTER = "P__SET_USE_FILTER";
const SET_QUICK_SEARCH = "P__SET_QUICK_SEARCH";
export default {
    namespaced: true,
    state: {
        model: {},
        prefs: {},
        conditions: [],
        filters: [], // список сохраненных фильтров
        pageName: "",
        isLoading: false,
        requestFilter: [],
        useFilter: [],
        quickSearch: false // переключается между true - false для отслеживания изменения в быстром поиске
    },
    getters: {
        [GETTERS.STR_QUERY](state: any, getters: any, rootState: any, rootGetters: any) {
            if (state.useFilter.length === 0) {
                return "";
            }
            let result: string = "";
            let condition: string = "";
            let value: string = "";
            if (state.useFilter.length === 1) {
                condition = state.useFilter[0].condition;
                value = state.useFilter[0].value;
                if (state.useFilter[0].condition === "ilike") {
                    condition = "ilike";
                    value = "*" + state.useFilter[0].value + "*";
                }
                if (state.useFilter[0].condition === "*ilike") {
                    condition = "ilike";
                    value = "*" + state.useFilter[0].value;
                }
                if (state.useFilter[0].condition === "ilike*") {
                    condition = "ilike";
                    value = state.useFilter[0].value + "*";
                }
                return state.useFilter[0].filter + "=" + condition + "." + value;
            }
            const and: any = [];
            const or: any = [];
            for (let i = 0; i < state.useFilter.length; i++) {
                if (i === 0 && state.useFilter[i + 1].operation === "and") {
                    and.push(state.useFilter[i]);
                    continue;
                }
                if (i === 0 && state.useFilter[i + 1].operation === "or") {
                    or.push([]);
                    or[or.length - 1].push(state.useFilter[i]);
                    continue;
                }
                if (state.useFilter[i + 1] === undefined) {
                    if (state.useFilter[i].operation === "and" && state.useFilter[i - 1].operation === "and") {
                        and.push(state.useFilter[i]);
                        continue;
                    }
                    if (state.useFilter[i].operation === "and" && state.useFilter[i - 1].operation === "or") {
                        and.push(state.useFilter[i]);
                        continue;
                    }
                    if (state.useFilter[i].operation === "or" && state.useFilter[i - 1].operation === "and") {
                        or[or.length - 1].push(state.useFilter[i]);
                        continue;
                    }
                    if (state.useFilter[i].operation === "or" && state.useFilter[i - 1].operation === "or") {
                        or[or.length - 1].push(state.useFilter[i]);
                        continue;
                    }
                }
                if (state.useFilter[i].operation === "and" && state.useFilter[i + 1].operation === "and") {
                    and.push(state.useFilter[i]);
                    continue;
                }
                if (state.useFilter[i].operation === "and" && state.useFilter[i + 1].operation === "or") {
                    or.push([]);
                    or[or.length - 1].push(state.useFilter[i]);
                    continue;
                }
                if (state.useFilter[i].operation === "or" && state.useFilter[i + 1].operation === "and") {
                    or[or.length - 1].push(state.useFilter[i]);
                    continue;
                }
                if (state.useFilter[i].operation === "or" && state.useFilter[i + 1].operation === "or") {
                    or[or.length - 1].push(state.useFilter[i]);
                    continue;
                }
            }
            if (and.length === 0 && or.length === 1) {
                for (const v of or[0]) {
                    condition = v.condition;
                    value = v.value;
                    if (v.condition === "ilike") {
                        condition = "ilike";
                        value = "*" + v.value + "*";
                    }
                    if (v.condition === "*ilike") {
                        condition = "ilike";
                        value = "*" + v.value;
                    }
                    if (v.condition === "ilike*") {
                        condition = "ilike";
                        value = v.value + "*";
                    }
                    if (result !== "") {
                        result += ",";
                    }
                    result += v.filter + "." + condition + "." + value;
                }
                return "or=(" + result + ")";
            }
            if (and.length > 0 && or.length === 0) {
                for (const v of and) {
                    condition = v.condition;
                    value = v.value;
                    if (v.condition === "ilike") {
                        condition = "ilike";
                        value = "*" + v.value + "*";
                    }
                    if (v.condition === "*ilike") {
                        condition = "ilike";
                        value = "*" + v.value;
                    }
                    if (v.condition === "ilike*") {
                        condition = "ilike";
                        value = v.value + "*";
                    }
                    if (result !== "") {
                        result += "&";
                    }
                    result += v.filter + "=" + condition + "." + value;
                }
                return result;
            }
            for (const v of and) {
                condition = v.condition;
                value = v.value;
                if (v.condition === "ilike") {
                    condition = "ilike";
                    value = "*" + v.value + "*";
                }
                if (v.condition === "*ilike") {
                    condition = "ilike";
                    value = "*" + v.value;
                }
                if (v.condition === "ilike*") {
                    condition = "ilike";
                    value = v.value + "*";
                }
                if (result !== "") {
                    result += ",";
                }
                result += v.filter + "." + condition + "." + value;
            }
            let str: string = "";
            for (const arr of or) {
                str = "";
                for (const v of arr) {
                    condition = v.condition;
                    value = v.value;
                    if (v.condition === "ilike") {
                        condition = "ilike";
                        value = "*" + v.value + "*";
                    }
                    if (v.condition === "*ilike") {
                        condition = "ilike";
                        value = "*" + v.value;
                    }
                    if (v.condition === "ilike*") {
                        condition = "ilike";
                        value = v.value + "*";
                    }
                    if (str !== "") {
                        str += ",";
                    }
                    str += v.filter + "." + condition + "." + value;
                }
                if (result !== "") {
                    result += ",";
                }
                result += "or(" + str + ")";
            }
            return "and=(" + result + ")";
        },
        [GETTERS.ARR_VIEW](state: any, getters: any, rootState: any) {
            const result: any = [];
            let reference: any = [];
            let value: string = "";

            for (const v of state.useFilter) {
                // в случае если справочник формируется пользовательской функцией
                // искать его в store до хука mounted компонента CompFilter бесполезно
                if (rootState.reference.references[state.model[v.filter].params.reference] === undefined
                    && state.model[v.filter].params.reference !== undefined
                ) {
                    reference = [];
                    if (Array.isArray(state.model[v.filter].params.reference)) {
                        reference = state.model[v.filter].params.reference;
                    } else {
                        reference = rootState.reference.references[state.model[v.filter].params.reference];
                    }
                    for (const n of reference) {
                        if (state.model[v.filter].component === "CompBool") {
                            const val: number = (v.value) ? 1 : 2;
                            if (val === n.id) {
                                value = n.name;
                                break;
                            }
                        } else {
                            if (state.model[v.filter].params.key !== undefined
                                && n[state.model[v.filter].params.key] !== undefined
                            ) {
                                if (v.value === n[state.model[v.filter].params.key]) {
                                    value = n.name;
                                    break;
                                }
                            } else {
                                if (v.value === n.id) {
                                    value = n.name;
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    if (v.name !== undefined) {
                        value = v.name;
                    } else {
                        if (state.model[v.filter].params.reference !== undefined) {
                            reference = [];
                            if (Array.isArray(state.model[v.filter].params.reference)) {
                                reference = state.model[v.filter].params.reference;
                            } else {
                                reference = rootState.reference.references[state.model[v.filter].params.reference];
                            }
                            let key = "id";
                            if (state.model[v.filter].params.key !== undefined) {
                                key = state.model[v.filter].params.key;
                            }
                            const item = reference.find((t: any) => t[key] === v.value);
                            value = item.name;
                        } else {
                            value = v.value;
                        }
                    }
                }
                result.push(
                    {
                        operation: "filters.operations." + v.operation,
                        title: state.model[v.filter].params.textView,
                        condition: "filters.conditions." + v.condition,
                        value
                    });
            }
            return result;
        }
    },
    mutations: {
        [SET_USE_FILTER](state: any, arr: any) {
            state.useFilter = arr;
        },
        [SET_REQUEST_FILTER](state: any, arr: any) {
            state.requestFilter = arr;
        },
        [SET_PAGE_NAME](state: any, name: any) {
            state.pageName = name;
        },
        [SET_MODEL](state: any, model: any) {
            state.model = model;
        },
        [SET_FILTERS](state: any, filters: any) {
            state.filters = filters;
        },
        [SET_PREFS](state: any, prefs: any) {
            state.prefs = prefs;
        },
        [SET_CONDITIONS](state: any, conditions: any) {
            state.conditions = conditions;
        },
        [SET_TEMPLATE](state: any, filterName: any) {
            const conditions: any = [];
            for (const v of state.conditions) {
                conditions.push(Object.assign({}, v));
            }
            if (state.prefs.filters === undefined) {
                state.prefs.filters = {};
            }
            if (state.prefs.filters[state.pageName] === undefined || state.prefs.filters[state.pageName].length === 0) {
                Vue.set(state.prefs.filters, state.pageName, []);
            }
            state.prefs.filters[state.pageName].push({ name: filterName, code: conditions });
            state.filters = state.prefs.filters[state.pageName];
        },
        [DEL_TEMPLATE](state: any, index: any) {
            state.filters.splice(index, 1);
        },
        [SET_LOADING](state: any, value: any) {
            state.isLoading = value;
        },
        [SET_QUICK_SEARCH](state: any, value: any) {
            state.quickSearch = value;
        }
    },
    actions: {
        // eslint-disable-next-line no-unused-vars
        [ACTIONS.SET_QUICK_SEARCH]({ state, commit }, conditions: any) {
            commit(SET_CONDITIONS, conditions);
            commit(SET_QUICK_SEARCH, !state.quickSearch);
        },
        [ACTIONS.SET_USE_FILTER]({ state, commit }) {
            commit(SET_USE_FILTER, state.conditions);
        },
        [ACTIONS.SET_REQUEST_FILTER]({ commit }, arr: any) {
            commit(SET_REQUEST_FILTER, arr);
        },
        async [ACTIONS.SET_MODEL]({ state, dispatch, commit, rootState, rootGetters }, model: any) {
            if (typeof model !== "object") {
                return false;
            }
            commit(SET_LOADING, true);
            commit(SET_CONDITIONS, []);
            commit(SET_USE_FILTER, []);
            for (const v in model) {
                if (model[v].component !== undefined) {
                    model[v].key = v;
                }
            }
            commit(SET_MODEL, model);
            let prefs: any = localStorage.getItem("prefs");
            if (prefs !== null) {
                prefs = JSON.parse(prefs);
            }
            if (
                prefs === null
                || prefs.prefs_changed === undefined
                || rootGetters.getUser.prefs_changed !== prefs.prefs_changed
            ) {
                prefs = await getPrefs();
                if (!prefs || prefs === null || prefs === "") {
                    prefs = {};
                }
                localStorage.setItem("prefs", JSON.stringify(
                    { prefs_changed: rootGetters.getUser.prefs_changed, prefs }
                )
                );
            }
            if (prefs.prefs !== undefined) {
                prefs = prefs.prefs;
            }
            commit(SET_PREFS, prefs);
            const name: string = rootGetters.getCurrentRoute.name + "_" + rootGetters.getUser.RoleCode;
            commit(SET_PAGE_NAME, name);
            if (prefs.filters !== undefined && prefs.filters[name] !== undefined) {
                commit(SET_FILTERS, prefs.filters[name]);
            } else {
                commit(SET_FILTERS, []);
            }
            const conditions: any = [];
            let condition: any = {};
            // код выполняется при запросе с другого роута по определенному фильтру
            if (state.requestFilter.length > 0) {
                for (const v in state.requestFilter) {
                    if (state.model[state.requestFilter[v].filter] !== undefined) {
                        if (
                            state.model[state.requestFilter[v].filter].params.reference !== undefined
                            && !Array.isArray(state.model[state.requestFilter[v].filter].params.reference)
                        ) {
                            // формируем референсы
                            // в случае если справочник формируется пользовательской функцией
                            // искать его в store до хука mounted компонента CompFilter бесполезно
                            // tslint:disable-next-line:max-line-length
                            if (rootState.reference.references[state.model[state.requestFilter[v].filter].params.reference] !== undefined) {
                                dispatch("reference/SET_REFERENCE",
                                    { name: state.model[state.requestFilter[v].filter].params.reference },
                                    { root: true }
                                );
                            }
                        }
                        // далее формируем условия отображаемого фильтра
                        condition = Object.assign({}, state.requestFilter[v]);
                        condition.component = state.model[state.requestFilter[v].filter].component;
                        conditions.push(condition);
                    }
                }
            } else {
                // если нет запроса с другого роута, смотрим есть ли в модели требования на фильтр по умолчанию
                for (const v in state.model) {
                    if (state.model[v].query === undefined) {
                        continue;
                    }
                    if (state.model[v].params.reference !== undefined
                        && !Array.isArray(state.model[v].params.reference)
                    ) {
                        // формируем референсы
                        // в случае если справочник формируется пользовательской функцией
                        // искать его в store до хука mounted компонента CompFilter бесполезно
                        if (rootState.reference.references[state.model[v].params.reference] !== undefined) {
                            dispatch("reference/SET_REFERENCE",
                                { name: state.model[v].params.reference },
                                { root: true });
                        }
                    }
                    // далее формируем условия отображаемого фильтра
                    if (Array.isArray(state.model[v].query)) {
                        for (const i in state.model[v].query) {
                            if (state.model[v].query[i] !== undefined) {
                                condition = Object.assign({}, state.model[v].query[i]);
                                condition.component = state.model[v].component;
                                condition.filter = v;
                                conditions.push(condition);
                            }
                        }
                    } else {
                        condition = Object.assign({}, state.model[v].query);
                        condition.component = state.model[v].component;
                        condition.filter = v;
                        conditions.push(condition);
                    }
                }
            }

            if (conditions.length > 0) {
                commit(SET_CONDITIONS, conditions);
                commit(SET_REQUEST_FILTER, []);
                commit(SET_USE_FILTER, conditions);
            }
            commit(SET_LOADING, false);
        },
        [ACTIONS.SET_CONDITIONS]({ commit }, conditions: any) {
            commit(SET_CONDITIONS, conditions);
        },
        async [ACTIONS.SET_TEMPLATE]({ state, commit }, filterName: any) {
            if (state.conditions.length === 0) {
                return true;
            }
            commit(SET_LOADING, true);
            commit(SET_TEMPLATE, filterName); // добавляем фильтр
            const prefs: any = getPrefsLocalStorage();
            prefs.prefs.filters = state.prefs.filters;
            const prefsChanged: any = await updatePrefs(prefs.prefs); // пишем фильтр в базу
            commit(SET_LOADING, false);
            if (prefsChanged) {
                // синхронизируем  prefs_changed в localStorage user и prefs
                updatePrefsChangeLocalStorage(prefsChanged, prefs);
            }
            return true;
        },
        async [ACTIONS.DEL_TEMPLATE]({ state, commit }, index: any) {
            commit(SET_LOADING, true);
            commit(DEL_TEMPLATE, index); // добавляем фильтр
            const prefs: any = getPrefsLocalStorage();
            prefs.prefs.filters = state.prefs.filters;
            const prefsChanged = await updatePrefs(prefs.prefs); // пишем фильтр в базу
            commit(SET_LOADING, false);
            if (prefsChanged) {
                // синхронизируем  prefs_changed в localStorage user и prefs
                updatePrefsChangeLocalStorage(prefsChanged, prefs);
            }
            return true;
        },
        [ACTIONS.SELECT_TEMPLATE]({ state, commit }, index: any) {
            commit(SET_CONDITIONS, state.filters[index].code);
        }
    }
};
function getPrefsLocalStorage() {
    let prefs = localStorage.getItem("prefs");
    if (prefs !== null) {
        prefs = JSON.parse(prefs);
    }
    return prefs;
}
function updatePrefsChangeLocalStorage(prefsChanged: any, prefs: any) {
    let user: any = localStorage.getItem("user");
    if (user !== null) {
        user = JSON.parse(user);
    }
    prefs.prefs_changed = prefsChanged;
    user.prefs_changed = prefsChanged;
    localStorage.setItem("prefs", JSON.stringify(prefs));
    localStorage.setItem("user", JSON.stringify(user));
}

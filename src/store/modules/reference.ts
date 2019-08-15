import Vue from "vue";
/*
 * Public
 */

export const ACTIONS = {
    SET_REFERENCE: "SET_REFERENCE"
};
/*
 * Private mutations
 */
const SET_REFERENCE = "P__SET_REFERENCE";

export default {
    namespaced: true,

    state: {
        references: {
            ref_role: [],
            ref_lang: [],
            ref_event_type: [],
            ref_event_way: [],
            ref_geo: []
        }
    },
    mutations: {
        [SET_REFERENCE](state, { name, items }) {
            Vue.set(state.references, name, items);
        }
    },
    actions: {
        // eslint-disable-next-line no-unused-vars
        [ACTIONS.SET_REFERENCE]({ state, getters, commit, rootGetters }, data: any) {
            let items: any = [];
            let lang: string = "ru";
            let name: string = "";
            if (typeof data === "object" && Array.isArray(data.items)) {
                name = data.name;
                if (state.references[name] !== undefined && state.references[name].length > 0) {
                    items = state.references[name];
                } else {
                    items = data.items;
                }
            } else {
                name = data.name;
                if ( state.references[name].length > 0 ) {
                    return;
                }
                const m: any = localStorage.getItem(name);
                if (m) {
                    const ref = JSON.parse(m);
                    if (data.lvl !== undefined) {
                        for ( const n of ref ) {
                            if (data.lvl === n.lvl) {
                                items.push( n );
                            }
                        }
                    } else {
                        items = ref;
                    }
                }
            }
            // определяем локаль
            lang = rootGetters.language;
            for (const key in items) {
                if (items[key].tr !== undefined && items[key].tr !== "") {
                    items[key].name = items[key].tr[lang];
                }
            }
            commit(SET_REFERENCE, { name, items });
        }
    }
};

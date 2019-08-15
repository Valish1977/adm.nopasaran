
import Vue from "vue";
import store from "./store/index";
import VueI18n, { LocaleMessages } from "vue-i18n";
import enLocale from "element-ui/lib/locale/lang/en";
import ruLocale from "element-ui/lib/locale/lang/ru-RU";

function loadElementLocale(locale: string): any {
  switch (locale) {
    case "eng":
    return enLocale;
    case "ru":
    return ruLocale;
    default:
    return ruLocale;
  }
}

Vue.use(VueI18n);

let startLang: string | null = localStorage.getItem("language");
if (!startLang) {
  startLang = process.env.VUE_APP_I18N_LOCALE || "ru";
}

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context("./locales", true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: LocaleMessages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
      Object.assign(messages[locale],  loadElementLocale(locale));
    }
  });
  const lang = localStorage.getItem("language");
  if (lang) {
    store.dispatch("setLanguage", lang);
  } else {
    store.dispatch("setLanguage", startLang);
    localStorage.setItem("language", startLang as string);
  }
  return messages;
}

export default new VueI18n({
  locale: startLang,
  fallbackLocale: startLang,
  messages: loadLocaleMessages()
});

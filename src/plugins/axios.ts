import Vue, { PluginObject } from "vue";
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || "";
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

const config = {
  baseURL: process.env.VUE_APP_API_ROOT
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

// tslint:disable-next-line:variable-name
const _axios = axios.create(config);

/* _axios.interceptors.request.use(
  (cfg: any) => {
    // Do something before request is sent
    return cfg;
  },
  (err: any) => {
    // Do something with request error
    return Promise.reject(err);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  (res: any) => {
    // Do something with response data
    return res;
  },
  (err: any) => {
    // Do something with response error
    return Promise.reject(err);
  }
); */

const Plugin: PluginObject<any> = {
  // tslint:disable-next-line:no-shadowed-variable
  install: (Vue: any) => {
    Vue.$axios = _axios;
  }
};
// tslint:disable-next-line:no-shadowed-variable
Plugin.install = (Vue: any) => {
  Vue.$axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    $axios: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;

import Vue from "vue";
import App from "./App.vue";

import axios from "axios";
import VueAxios from "vue-axios";

import MuseUI from "muse-ui";
import "muse-ui/dist/muse-ui.css";
import "./assets/font/material-cons.css";

import theme from "muse-ui/lib/theme";
theme.use("dark");

axios.defaults.baseURL = "/api";

axios.interceptors.response.use(res => res.data);

Vue.use(MuseUI);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

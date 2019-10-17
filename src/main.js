import Vue from "vue";
import App from "./App.vue";

import axios from "axios";
import VueAxios from "vue-axios";

import MuseUI from "muse-ui";
import Toast from "muse-ui-toast";
import "muse-ui/dist/muse-ui.css";
import "./assets/font/material-cons.css";
import BaiduMap from "vue-baidu-map";

import theme from "muse-ui/lib/theme";
theme.use("dark");

const isPro = process.env.NODE_ENV === "production";

axios.defaults.baseURL = isPro ? "/" : "/api";
axios.interceptors.response.use(res => res.data);

Vue.use(MuseUI);
Vue.use(Toast);
Vue.use(VueAxios, axios);
Vue.use(BaiduMap, {
  ak: "RGzUO0zOS7a8fZsBKnGpalpRSWQnWM33" //这个地方是官方提供的ak密钥
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

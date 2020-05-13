import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// axios
import axios from "axios";
Vue.prototype.axios = axios;
// axios.defaults.baseURL = "xxxxx";  //这里使用自己下载的网易云接口地址
axios.defaults.baseURL =
  process.env.NODE_ENV == "production" ? "/" : "http://localhost:3000/";

// 引入Vant
import Vant from "vant";
import "vant/lib/index.css";
Vue.use(Vant);

// 懒加载
import Vuelazyload from "vue-lazyload";
Vue.use(Vuelazyload, {
  error: require("./assets/error.jpg"),
  loading: require("./assets/loading.gif")
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

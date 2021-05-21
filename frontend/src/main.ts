import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.filter("truncate", function (text: string, length: number, suffix: string) {
  return text.length > length ? text.substring(0, length) + suffix : text;
});

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
  beforeCreate() {
    console.log("Vue initialized 🎉");
  },
}).$mount("#app");

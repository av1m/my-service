import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import service from "./modules/service";
import alert from "./modules/alert";
import utils from "./modules/utils";
import { AllState } from "./types";

Vue.use(Vuex);

export default new Vuex.Store<AllState>({
  modules: { user, service, alert, utils },
  mutations: {
    save(state) {
      localStorage.setItem("vuex", JSON.stringify(state));
    },
    read(state) {
      const vuex = JSON.parse(localStorage.getItem("vuex") || "{}");
      this.replaceState(Object.assign(state, vuex));
    },
  },
});

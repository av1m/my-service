import { Module } from "vuex";
import { RootStore } from "../types";

const alert: Module<any, RootStore> = {
  namespaced: true,
  state: () => ({
    type: null,
    message: null,
  }),
  mutations: {
    success(state, message) {
      state.type = "success";
      state.message = message;
    },
    error(state, message) {
      state.type = "error";
      state.message = message;
    },
    info(state, message) {
      state.type = "info";
      state.message = message;
    },
    clear(state) {
      state.type = null;
      state.message = null;
    },
  },
  actions: {
    success({ commit }, message) {
      commit("success", message);
    },
    error({ commit }, message) {
      commit("error", message);
    },
    info({ commit }, message) {
      commit("info", message);
    },
    clear({ commit }) {
      commit("clear");
    },
  },
  getters: {},
};

export default alert;

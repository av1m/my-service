import { Module } from "vuex";
import store from "@/store/index";
import { RootStore } from "../types";
import { deleteService, getTimeline } from "@/api/services";
import { aggregateServices } from "@/plugins/utils";
import { AxiosResponse } from "axios";
import { getAll } from "@/api/tags";

const service: Module<any, RootStore> = {
  namespaced: true,
  state: () => ({
    timeline: [],
    tags: [],
  }),
  mutations: {
    updateTimeline(state, services) {
      state.timeline = services;
      store.commit("save", state);
    },
    updateTags(state, tags) {
      state.tags = tags;
      store.commit("save", state);
    },
  },
  actions: {
    loadTimeline({ commit }) {
      getTimeline().then((payload: AxiosResponse) => {
        commit("updateTimeline", aggregateServices(payload.data));
      });
    },
    loadTags({ commit }) {
      getAll().then((payload: AxiosResponse) => {
        commit("updateTags", payload.data?.tags);
      });
    },
    deleteService({ commit }, serviceId: string) {
      deleteService(serviceId).then(() => {
        store.dispatch(
          "alert/success",
          "The service has been deleted, refresh",
          {
            root: true,
          }
        );
      });
    },
  },
  getters: {
    belongAuthUser: (_state, _getters, _rootState, rootGetters) => (
      id: string
    ) => id && rootGetters["user/getServiceIds"].indexOf(id) !== -1,
  },
};

export default service;

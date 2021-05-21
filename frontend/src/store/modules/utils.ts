import { BACKEND_BASE_URL } from "@/api";
import { Module } from "vuex";
import { RootStore } from "../types";

const utils: Module<any, RootStore> = {
  namespaced: true,
  state: () => ({}),
  mutations: {},
  actions: {},
  getters: {
    loadPhoto: () => (photo: string): string => {
      if (!photo || photo.toLowerCase().startsWith("http")) return photo;
      return BACKEND_BASE_URL + "/static/" + photo;
    },
  },
};

export default utils;

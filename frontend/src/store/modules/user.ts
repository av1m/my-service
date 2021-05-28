import { Module } from "vuex";
import store from "@/store/index";
import { IUser, RootStore, ServiceState } from "../types";
import { changePassword, login, register } from "@/api/auth";
import { getSearch, getUser, updateUser, subscribeService } from "@/api/users";
import router from "@/router";
import { loginType } from "@/api/types";
import { AxiosResponse } from "axios";
import { isUserState } from "@/store/types";
import { RawLocation } from "vue-router";

const user: Module<any, RootStore> = {
  namespaced: true,
  state: () => ({
    token: "",
    user: "",
    status: "",
    search: [],
    tmp_user: {},
  }),
  mutations: {
    loginRequest(state, user) {
      state.status = { loggingIn: false };
      state.user = user;
      store.commit("save", state);
    },
    loginFailure(state) {
      state.status = {};
      state.user = null;
      store.commit("save", state);
    },
    loginSuccess(state, payload: loginType) {
      state.status = { loggedIn: true };
      state.user = payload.user;
      state.token = payload.token;
      store.commit("save", state);
    },
    logout(state) {
      state.status = {};
      state.user = null;
      state.token = null;
      store.commit("save", state);
      store.dispatch("alert/info", "The user is disconnected", {
        root: true,
      });
      router.push("/login");
    },
    updateSearch(state, services) {
      state.search = services;
      store.commit("save", state);
    },
    updateTmpUser(state, user) {
      state.tmp_user = user;
    },
    updateUser(state, user) {
      state.user = user;
      store.commit("save", state);
    },
  },
  actions: {
    login({ dispatch, commit }, { email, password }) {
      commit("loginRequest", { email });
      login({ email, password }).then(
        (payload: AxiosResponse) => {
          commit("loginSuccess", payload.data);
          dispatch("alert/success", "The user has been connected", {
            root: true,
          });
          router.push(
            (router.currentRoute.query?.redirect || "/timeline") as RawLocation
          );
        },
        (error: any) => {
          commit("loginFailure", error);
        }
      );
    },
    register(
      { dispatch, commit },
      payload: {
        email: string;
        password: string;
        firstname: string;
        lastname: string;
      }
    ) {
      return new Promise<boolean>((resolve, reject) => {
        register(payload)
          .then((payload: AxiosResponse) => {
            commit("loginSuccess", payload.data);
            dispatch("alert/success", "The user has been registered", {
              root: true,
            });
            resolve(true);
          })
          .catch(() => {
            reject;
          });
      });
    },
    logout({ commit }) {
      commit("logout");
    },
    loadSearch({ commit }, { query }) {
      getSearch(query).then((payload: AxiosResponse) => {
        commit("updateSearch", payload.data);
      });
    },
    loadUser({ commit }, { id, update_user = false }) {
      const commit_name = update_user ? "updateUser" : "updateTmpUser";
      commit(commit_name, {});
      getUser(id).then((payload: AxiosResponse) => {
        commit(commit_name, payload.data);
      });
    },
    changePassword({ commit }, { oldPassword, newPassword }) {
      changePassword({
        oldPassword,
        newPassword,
      }).then(() => {
        store.dispatch("alert/success", "The password has been modified", {
          root: true,
        });
      });
    },
    updateUser({ commit }, payload) {
      updateUser({ ...payload }).then(() => {
        store.dispatch("alert/success", "The user has been modified", {
          root: true,
        });
      });
    },
    subscribeService({ commit }, id: string) {
      subscribeService({ id: id }).catch(() => {
        store.dispatch(
          "alert/error",
          "An error occurred while registering the payment",
          {
            root: true,
          }
        );
      });
    },
  },
  getters: {
    isLogged: (state): boolean =>
      typeof state.token != "undefined" && state.token,
    getName: (state): string =>
      isUserState(state.user)
        ? state.user.lastname + " " + state.user.firstname
        : "",
    getUser: (state): IUser => state.user,
    getServiceIds: (state): string[] =>
      state.user.services.map((s: ServiceState) => s.serviceId),
    belongUserPayment: (state) => (id: string) =>
      id && state.user.payments.indexOf(id) !== -1,
  },
};

export default user;

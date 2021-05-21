import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Home from "@/components/Home.vue";
import Account from "@/components/Account.vue";
import User from "@/components/User.vue";
import AddService from "@/components/AddService.vue";
import Login from "@/components/Login.vue";
import NotFound from "@/components/NotFound.vue";
import store from "@/store/index";

Vue.use(VueRouter);

// We initialize VUEX here because if it is initialized in hand.ts,
// we will have an empty blind here
store.commit("read");

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/About.vue"),
  },
  {
    path: "/me",
    name: "Me",
    component: Account,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/add",
    name: "Add",
    component: AddService,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/user/:id",
    name: "Account",
    component: User,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "signup" */ "../components/Register.vue"),
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "*",
    redirect: { name: "NotFound" },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash };
    if (savedPosition) return savedPosition;
    return { x: 0, y: 0 };
  },
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters["user/isLogged"]) {
      next({ name: "Login" });
    } else {
      next(); // go to wherever I'm going
    }
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
});

export default router;

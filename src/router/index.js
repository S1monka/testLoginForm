import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const isLogin = () => {
  if (!store.state.isLogin) {
    return {
      name: "loginPage",
      params: { message: "You need to login first" },
    };
  } else {
    return { name: "profilePage" };
  }
};

const routes = [
  {
    path: "/",
    redirect: isLogin,
  },
  {
    path: "/loginPage",
    name: "loginPage",
    component: () => import("@/views/loginPage.vue"),
    beforeEnter: (to, from, next) => {
      if (store.state.isLogin) {
        next({ name: "profilePage" });
      } else next();
    },
  },
  {
    path: "/profilePage",
    name: "profilePage",
    component: () => import("@/views/profilePage.vue"),
    beforeEnter: (to, from, next) => {
      if (!store.state.isLogin) {
        next({ name: "loginPage" });
      } else next();
    },
  },
  {
    path: "*",
    redirect: isLogin,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

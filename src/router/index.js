import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/header", component: () => import("../components/Header.vue") },
    { path: "/footer", component: () => import("../components/Footer.vue") },
    { path: "/home", component: () => import("../components/Home.vue") },
    {
      path: "/login",
      component: () => import("../components/Login.vue")
    },
    {
      path: "/register",
      component: () => import("../components/Register.vue")
    },
    {
      path: "/sidebar",
      component: () => import("../components/Sidebar.vue")
    },
    {
      path: "/sheet",
      component: () => import("../components/Sheet.vue")
    },
    {
      path: "/user",
      component: () => import("../components/user.vue")
    }
  ]
});

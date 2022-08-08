import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Cart from "../views/Cart.vue";
import store from "../store";
import axios from "axios";
const router = createRouter({
  history: createWebHistory(),
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/cart",
      name: "cart",
      component: Cart,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/checkout",
      name: "checkout",
      component: Register,
      meta: {
        auth: true,
      },
    },
  ],
});

const checkAuth = (to, from, next) => {
  if (localStorage.getItem("token")) {
    axios
      .get(`${process.env.URL ? process.env.URL : 'http://localhost:3000'}/api/user/profile`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        store.dispatch("checkAuth", res.data.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        localStorage.removeItem("token");
        store.dispatch("checkAuth", null);
      })
      .finally(() => {
        if (to.meta.auth && !store.getters.isAuthenticated) {
          localStorage.setItem("pathToLoadAfterLogin", to.path);
          next("/login");
        } else {
          next();
        }
      });
  } else {
    localStorage.removeItem("token");
    store.dispatch("checkAuth", null);
    if (to.meta.auth && !store.getters.isAuthenticated) {
      localStorage.setItem("pathToLoadAfterLogin", to.path);
      next("/login");
    } else {
      next();
    }
  }
};

router.beforeEach((to, from, next) => {
  checkAuth(to, from, next);
});

export default router;

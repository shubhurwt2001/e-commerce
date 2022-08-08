import { createStore } from "vuex";
import router from "../router";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      user: null,
      isAuthenticated: false,
      localCart: localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [],
    };
  },
  getters: {
    user: (state) => {
      if (state.user) {
        return state.user;
      } else {
        return null;
      }
    },
    localCart: (state) => state.localCart,
    isAuthenticated: (state) => state.isAuthenticated,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setAuth(state, payload) {
      state.isAuthenticated = payload;
    },
    setLocalCart(state) {
      state.localCart = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
    },
  },
  actions: {
    checkAuth(context, user) {
      if (user) {
        context.commit("setAuth", true);
        context.commit("setUser", user);
      } else {
        context.commit("setAuth", false);
        context.commit("setUser", null);
      }
    },
    changeLocalCart(context) {
      context.commit("setLocalCart");
    },
    logout() {
      localStorage.removeItem("token");
      router.replace("/login");
    },
  },
});

export default store;

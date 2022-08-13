<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">E-commerce</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <RouterLink class="nav-link" active-class="active" to="/"
            >Home</RouterLink
          >
          <RouterLink class="nav-link" active-class="active" to="cart"
            >My Cart ({{
              user ? user.cart.length : localCart.length
            }})</RouterLink
          >
          <RouterLink
            v-if="isAuthenticated"
            class="nav-link"
            active-class="active"
            to="orders"
            >My Orders ({{ user.orders.length }})</RouterLink
          >
          <RouterLink
            v-if="!isAuthenticated"
            class="nav-link"
            active-class="active"
            to="login"
            >Login</RouterLink
          >
          <RouterLink
            v-if="!isAuthenticated"
            class="nav-link"
            active-class="active"
            to="register"
            >Register</RouterLink
          >
          <RouterLink
            class="nav-link"
            to=""
            v-if="isAuthenticated"
            @click="logout"
            >Logout</RouterLink
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Header",
  computed: {
    ...mapGetters(["isAuthenticated"]),
    ...mapGetters(["user"]),
    ...mapGetters(["localCart"]),
  },
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>

<style></style>

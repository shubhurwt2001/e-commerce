<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mt-5 offset-md-2">
        <div class="card card-primary">
          <div class="card-header">
            <h5>Login</h5>
          </div>
          <form @submit.prevent="login">
            <div class="card-body">
              <div class="form-group my-3">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  name="email"
                  v-model.trim="email"
                />
              </div>
              <div class="form-group my-3">
                <label for="password">Password</label>
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  name="password"
                  v-model="password"
                />
              </div>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  mounted() {
    if (this.isAuthenticated) {
      this.$router.push({
        path: localStorage.getItem("pathToLoadAfterLogin")
          ? localStorage.getItem("pathToLoadAfterLogin")
          : "/",
      });
    }
  },
  methods: {
    ...mapActions(["changeLocalCart"]),
    login() {
      if (!this.email)
        return this.$swal({ text: "Please provide email", icon: "error" });
      if (!this.password)
        return this.$swal({ text: "Please provide password", icon: "error" });

      axios
        .post(`${process.env.VUE_APP_URL ? process.env.VUE_APP_URL : 'http://localhost:3000'}/api/user/login`, {
          email: this.email,
          password: this.password,
          cart: localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart"))
            : [],
        })
        .then((res) => {
          localStorage.setItem("token", res.data.data.token);
          localStorage.removeItem("cart");
          this.changeLocalCart();
          var redirectPath = localStorage.getItem("pathToLoadAfterLogin");
          if (redirectPath) {
            localStorage.removeItem("pathToLoadAfterLogin");
            this.$router.push({
              path: redirectPath,
            });
          } else {
            this.$router.push({ path: "/" });
          }
        })
        .catch((err) => {
          this.$swal({ text: err.response.data.error, icon: "error" });
        });
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mt-5 offset-md-2">
        <div class="card card-primary">
          <div class="card-header">
            <h5>Register</h5>
          </div>
          <form @submit.prevent="register">
            <div class="card-body">
              <div class="form-group my-3">
                <label for="name">Name</label>
                <input
                  type="text"
                  id="name"
                  class="form-control"
                  name="name"
                  v-model="name"
                />
              </div>
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
              <div class="form-group my-3">
                <label for="confirm">Confirm Password</label>
                <input
                  type="password"
                  id="confirm"
                  class="form-control"
                  name="confirm"
                  v-model="confirm"
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
import { mapGetters } from 'vuex';
export default {
  name: "Register",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirm: "",
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
    register() {
      if (!this.name)
        return this.$swal({ icon: "error", text: "Please provide email" });
      if (!this.email)
        return this.$swal({ icon: "error", text: "Please provide email" });
      if (!this.password)
        return this.$swal({ icon: "error", text: "Please provide password" });
      if (!this.confirm)
        return this.$swal({
          icon: "error",
          text: "Please provide confirm password",
        });
      if (this.password !== this.confirm)
        return this.$swal({
          icon: "error",
          text: "Password confirmation does not match",
        });
      axios
        .post(`${process.env.URL ? process.env.URL : 'http://localhost:3000'}/api/user/register`, {
          name: this.name,
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ path: "/login" });
        })
        .catch((err) => {
          return this.$swal({ icon: "error", text: err.response.data.error });
        });
    },
  },
};
</script>

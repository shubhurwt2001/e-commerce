<template>
  <div class="px-4 py-5 mb-5 text-center">
    <!-- <img class="d-block mx-auto mb-4" src="" alt="" width="72" height="57" /> -->
    <h1 class="display-5 fw-bold">{{ title }}</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">{{ description }}</p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <RouterLink
          type="button"
          class="btn btn-primary btn-lg px-4 gap-3"
          to="login"
          v-if="!isAuthenticated"
        >
          Login
        </RouterLink>
        <RouterLink
          type="button"
          class="btn btn-outline-secondary btn-lg px-4"
          to="register"
          v-if="!isAuthenticated"
        >
          Register
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Hero",
  props: {
    title: String,
    description: String,
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
    ...mapGetters(["user"]),
  },
};
</script>
<style scoped>
.text-center {
  background-color: #eee;
}
</style>

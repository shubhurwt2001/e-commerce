<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <Header></Header>
    <RouterView />
  </div>
</template>

<script>
import Header from "./components/Header.vue";

export default {
  name: "App",
  components: {
    Header,
  },
};
</script>

<template>
  <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
    <Navigation app />
    <v-main transition="slide-x-transition">
      <v-container fluid>
        <Error />
        <router-view :key="$route.fullPath" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Navigation from "@/components/Navigation.vue"; // @ is an alias to /src
import Error from "@/components/Error.vue"; // @ is an alias to /src

export default Vue.extend({
  name: "App",
  components: {
    Navigation,
    Error,
  },
  mounted: function () {
    const theme: string = localStorage.getItem("is_dark_theme") || "false";
    this.$vuetify.theme.dark = theme === "true";
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
});
</script>

<style lang="css">
* {
  font-family: Roboto, sans-serif;
}
.routerLink {
  text-decoration: none;
}
</style>

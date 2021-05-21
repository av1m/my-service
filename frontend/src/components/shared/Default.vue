<template>
  <v-app id="app">
    <Navigation v-if="showMenu()" />
    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="12" sm="2"> </v-col>

          <v-col cols="8" sm="8">
            <v-sheet
              min-height="70vh"
              rounded="lg"
              :elevation="2"
              class="pa-md-4 mx-lg-auto"
            >
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="2"> </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  methods: {
    showMenu() {
      return false;
    },
  },

  data: () => ({}),
});
</script>

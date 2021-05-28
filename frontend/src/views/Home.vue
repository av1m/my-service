<template>
  <v-row>
    <v-col cols="12" sm="1"> </v-col>
    <v-col cols="12" sm="10">
      <div class="text-center">
        <v-img
          contain
          aspect-ratio="4"
          src="@/assets/logo.svg"
          lazy-src="@/assets/icon.svg"
        />
        <div v-if="isLogged" class="pb-10">
          <v-btn color="primary" depressed to="/timeline">
            See my timeline
          </v-btn>
        </div>
        <div class="text-subtitle-1 font-weight-light pb-5">
          Look for your happiness <br />
          Try to search for anything <br />
          <v-icon color="primary">mdi-search-web</v-icon>
        </div>
        <v-sheet class="pa-3" rounded="xl" elevation="5">
          <Search></Search>
        </v-sheet>
      </div>
    </v-col>
    <v-col cols="12" sm="1"> </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import Search from "@/components/Search.vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  components: { Search },
  computed: { ...mapGetters("user", ["isLogged"]) },
});
</script>
<style scoped>
.x-row {
  height: 100%;
}
</style>

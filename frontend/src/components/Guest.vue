<template>
  <v-row>
    <v-col cols="12" sm="1"> </v-col>
    <v-col cols="12" sm="10">
      <div class="text-center">
        <v-img
          contain
          aspect-ratio="4"
          src="@/assets/logo.png"
          lazy-src="https://picsum.photos/300/200"
        />

        <div class="text-subtitle-1 font-weight-light pb-10">
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
import Search from "@/components/shared/Search.vue";

export default Vue.extend({
  components: { Search },
  data: () => ({}),
});
</script>
<style scoped>
.x-row {
  height: 100%;
}
</style>

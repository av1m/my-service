<template v-if="isLogged">
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        color="main primary--text"
        fixed
        right
        bottom
        elevation="5"
        fab
        link
        to="/add"
      >
        <v-icon dark>mdi-text-box-plus</v-icon>
      </v-btn>
    </template>
    <span>Add a service</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

export default Vue.extend({
  data: () => ({}),
  components: {},
  computed: {
    ...mapGetters("user/", ["isLogged"]),
  },
  methods: {},
});
</script>

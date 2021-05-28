<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="12" sm="1" md="2" lg="3"></v-col>
      <v-col cols="12" sm="10" md="8" lg="6">
        <slot> ... </slot>
      </v-col>
      <v-col cols="12" sm="1" md="2" lg="3"></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapState } from "vuex";

export default Vue.extend({
  data: () => ({}),
  computed: {
    ...mapState("user", ["search"]),
    ...mapGetters("utils", ["loadPhoto"]),
  },
  methods: {},
  watch: {},
});
</script>

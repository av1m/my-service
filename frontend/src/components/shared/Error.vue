<template>
  <div name="snackbars">
    <v-snackbar
      v-model="show"
      :color="type"
      :timeout="timeout"
      rounded="xl"
      elevation="24"
      top
      outlined
      right
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          icon
          :color="type"
          v-bind="attrs"
          @click="
            clear();
            show = false;
          "
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
export default Vue.extend({
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type.startsWith("alert/")) {
        this.message = state.alert.message;
        this.type = state.alert.type;
        this.show = true;
      }
    });
  },
  data() {
    return {
      show: false,
      timeout: 4000,
      type: "",
      message: "",
    };
  },
  methods: {
    ...mapActions("alert", ["clear"]),
  },
});
</script>

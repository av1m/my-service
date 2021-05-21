<template>
  <!--https://stackoverflow.com/questions/61134607/how-to-do-autocomplete-suggestion-search-bar-in-vuejs -->
  <v-autocomplete
    v-model="model"
    :loading="loading"
    :items="getSearch"
    :search-input.sync="callSearch"
    menu-props="closeOnContentClick"
    class="rounded-lg"
    label="Search users and services"
    placeholder="Search users and services"
    prepend-inner-icon="mdi-magnify"
    chips
    hide-no-data
    hide-details
    hide-selected
    clearable
    solo
    filled
    dense
    flat
    item-text="search"
    item-value="_id"
    v-if="this.isLogged"
    color="primary"
    background-color="background"
    ><!--cache-items-->
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          Search for your favorite
          <strong>User</strong> or <strong>Service</strong>
        </v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item link :to="'/user/' + item.user._id">
        <v-list-item-avatar class="headline font-weight-light white--text">
          <v-img :src="loadPhoto(item.photo)" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
          <v-list-item-subtitle
            v-html="item.user.firstname + ' ' + item.user.lastname"
          ></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-avatar size="40"
            ><v-img :src="loadPhoto(item.user.profile)"
          /></v-avatar>
        </v-list-item-action>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapState } from "vuex";

export default Vue.extend({
  data: () => ({
    loading: false,
    callSearch: null,
    model: "",
    timeout: 0,
  }),
  computed: {
    ...mapState("user", ["search"]),
    ...mapGetters("user", ["isLogged"]),
    ...mapGetters("utils", ["loadPhoto"]),
    getSearch: function () {
      if (!this.search || this.search.length == 0) return [];
      const search: any = [];
      for (const u of this.search) {
        if (u?.services.length == 0) {
          const s = { user: { ...u }, search: "" };
          s.search = JSON.stringify(s);
          search.push(s);
        }
        u?.services.forEach((service: any) => {
          const s = { ...service, user: { ...u } };
          s.search = JSON.stringify(s);
          search.push(s);
        });
      }
      return search;
    },
  },
  methods: {
    async querySelections(query: string) {
      this.loading = true;
      clearTimeout(this.timeout); // Lets do not send a search request for each written character
      this.timeout = setTimeout(async () => {
        await this.$store.dispatch("user/loadSearch", { query: query });
        this.loading = false;
      }, 1000);
    },
  },
  watch: {
    callSearch(val) {
      val && val !== this.model && this.querySelections(val);
    },
  },
});
</script>

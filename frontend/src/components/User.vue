<template>
  <div>
    <v-skeleton-loader
      type="list-item-avatar, divider, list-item-three-line, image, article"
      elevation="2"
      v-if="!this.getUser._id"
    ></v-skeleton-loader>
    <v-card
      class="mx-auto ma-5 rounded-lg"
      elevation="2"
      max-width="1100"
      outlined
      v-else
    >
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-3">
            {{ this.getUser.lastname }} {{ this.getUser.firstname }}
          </v-list-item-title>
          <v-list-item-subtitle
            class="font-italic font-weight-light caption"
            v-if="this.getUser.created_at"
          >
            <v-icon>mdi-account-plus</v-icon> Created at
            {{ this.getUser.created_at }}
          </v-list-item-subtitle>
          <v-list-item-subtitle
            class="font-italic font-weight-light caption"
            v-if="this.getUser.updated_at"
          >
            <v-icon>mdi-update</v-icon> Updated at
            {{ this.getUser.updated_at }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-avatar tile size="120" color="grey" class="rounded-lg"
          ><v-img :src="loadPhoto(this.getUser.profile)"
        /></v-list-item-avatar>
      </v-list-item>
      <v-card-text>
        <h2 class="pb-5">Services</h2>
        <div v-if="this.getServices.length > 0">
          <div v-for="(item, index) in this.getServices" :key="index">
            <Service
              class="mb-7"
              :elevation="hover ? 3 : 1"
              :item="item"
              :showUser="false"
            ></Service>
          </div>
        </div>
        <div v-else>
          {{ this.getUser.firstname || "This user" }} has not created any
          service
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Service from "@/components/Service.vue";
import { mapGetters, mapState } from "vuex";
import { ServiceState } from "@/store/types";
import { aggregateServices } from "@/plugins/utils";

export default Vue.extend({
  data: () => ({
    hover: false,
    dialog: true,
  }),
  components: {
    Service,
  },
  computed: {
    ...mapState("user", ["tmp_user"]),
    ...mapGetters("utils", ["loadPhoto"]),
    getUser: function (): any {
      return this.tmp_user;
    },
    getServices(): ServiceState[] {
      return aggregateServices([this.getUser]);
    },
  },
  methods: {},
  beforeCreate() {
    if (this.$route.params.id === this.$store.getters["user/getUser"]._id) {
      return this.$router.push("/me");
    }
    this.$store.dispatch("user/loadUser", {
      id: this.$route.params.id,
    });
  },
});
</script>

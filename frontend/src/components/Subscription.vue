<template>
  <div>
    <v-row>
      <v-col cols="12" sm="1"> </v-col>
      <v-col cols="12" sm="10">
        <p class="text-h3 pa-4 font-weight-light">Your subscriptions</p>
        <div v-if="!show">
          <v-skeleton-loader
            v-for="(n, index) in 3"
            v-bind:key="index"
            elevation="1"
            type="card"
            class="rounded-xl mb-7"
          ></v-skeleton-loader>
        </div>
        <div v-else>
          <div v-if="subscribed.length > 0">
            <div v-for="(item, index) in subscribed" :key="index">
              <Service class="mb-7" :item="item"></Service>
            </div>
          </div>
          <div v-else class="pa-4">
            You have not yet subscribed to any service, search or
            <router-link to="/">discover new services</router-link>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="1"> </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Service from "@/components/Service.vue";
import { getSubscribed } from "@/api/users";
import { aggregateServices } from "@/plugins/utils";
import { ServiceState } from "@/store/types";

export default Vue.extend({
  data: () => ({
    show: false,
    subscribed: [] as ServiceState[],
  }),
  created() {
    getSubscribed().then((res) => {
      this.show = true;
      return (this.subscribed = aggregateServices(res.data));
    });
  },
  components: { Service },
});
</script>

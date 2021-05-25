<template>
  <v-hover v-slot="{ hover }">
    <v-card rounded="xl" :hover="hover">
      <v-img
        height="250"
        v-bind:src="loadPhoto(item.photo)"
        gradient="to top right, rgba(100,80,80,.3), rgba(100,100,100,.1)"
        lazy-src="https://picsum.photos/id/11/100/60"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
        <v-app-bar flat color="rgba(0, 0, 0, 0)">
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon color="white" v-bind="attrs" v-on="on">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-img
                v-bind:src="loadPhoto(item.photo)"
                lazy-src="https://picsum.photos/id/11/100/60"
                ><v-btn
                  raised
                  icon
                  dense
                  small
                  color="primary"
                  elevation="3"
                  @click="dialog = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-img
              >
            </v-card>
          </v-dialog>
          <v-menu
            transition="slide-x-transition"
            bottom
            left
            v-if="isCurrentUser"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon color="white" v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-subheader>Options</v-subheader>
              <v-list-item-group>
                <v-list-item @click="deleteService(item.serviceId)">
                  <v-list-item-icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-app-bar>
        <v-card-title class="white--text mt-8" v-if="showUser">
          <v-avatar size="56">
            <router-link :to="'/user/' + item._id">
              <v-img :src="loadPhoto(item.profile)" />
            </router-link>
          </v-avatar>
          <div class="ml-3">
            {{ item.lastname | uppercase }} &nbsp; {{ item.firstname }} <br />
            <div class="text-caption dark--text">5 min ago</div>
          </div>
        </v-card-title>
      </v-img>
      <v-card-text>
        <div class="font-weight-bold ml-8 mb-2">
          {{ item.name }}
        </div>
        <div class="ml-8 mb-5" v-if="item.description">
          {{ item.description | truncate(300) }}
        </div>
        <div class="ml-8 mb-2">
          <v-row>
            <v-col>
              <v-chip
                v-for="(tag, i) in item.tags"
                class="mr-2 mb-2"
                color="green"
                small
                :key="i"
                outlined
                >{{ tag }}</v-chip
              >
            </v-col>
            <v-col align="end">
              <v-chip color="orange" text-color="white" small>
                {{ item.price }}
                <v-avatar right>
                  <v-icon> mdi-currency-eur </v-icon>
                </v-avatar>
              </v-chip>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-card-actions>
        <div v-if="!isCurrentUser">
          <v-btn
            color="primary"
            rounded
            text
            @click="show = !show"
            v-if="!belongUserPayment(item.serviceId)"
          >
            Subscribe
          </v-btn>
          <v-btn v-else color="success" rounded text> Subscribed </v-btn>
        </div>

        <v-spacer></v-spacer>

        <v-btn icon @click="show = !show">
          <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
          <v-card-text>
            <Subscribe :service="item"></Subscribe>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import Subscribe from "@/components/Subscribe.vue";

export default Vue.extend({
  components: { Subscribe },
  filters: {
    uppercase: (str: string) => str?.toUpperCase(),
    truncate: (source: string, size: number): string =>
      source.length > size ? source.slice(0, size) + "..." : source,
  },
  props: {
    item: Object,
    showUser: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    show: false,
    dialog: false,
    isCurrentUser: false,
  }),
  computed: {
    ...mapGetters("user", ["belongUserPayment"]),
    ...mapGetters("service", ["belongAuthUser"]),
    ...mapGetters("utils", ["loadPhoto"]),
  },
  methods: {
    ...mapActions("service", ["deleteService"]),
  },
  created() {
    this.isCurrentUser = this.belongAuthUser(this.item.serviceId);
  },
});
</script>

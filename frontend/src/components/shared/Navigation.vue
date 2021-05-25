<template>
  <div>
    <v-navigation-drawer v-model="drawer" app>
      <v-list nav shaped>
        <v-list-item-group v-model="group" active-class="primary main--text">
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item to="/me" v-if="isLogged">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
          <v-list-item to="/subscription" v-if="isLogged">
            <v-list-item-icon>
              <v-icon>mdi-ballot</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Subscriptions</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn v-if="isLogged" @click="logout" block color="primary">
            Logout&nbsp;<v-icon>mdi-logout</v-icon>
          </v-btn>
          <v-btn v-else block text outlined color="primary">
            <router-link to="/login" class="routerLink"
              ><v-icon>mdi-login</v-icon>&nbsp;Login</router-link
            >
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      id="appbar"
      collapse-on-scroll
      elevate-on-scroll
      dense
      min-width="300"
      color="main"
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>
        <router-link to="/">
          <v-img max-width="250" src="@/assets/logo.png" />
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <Search />
      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            :href="`https://github.com/av1m/my-service`"
            icon
          >
            <v-icon>mdi-heart</v-icon>
          </v-btn>
        </template>
        <span>Star this project</span>
      </v-tooltip>

      <v-btn icon>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              v-if="!$vuetify.theme.dark"
              @click="darkMode"
              >mdi-moon-waxing-crescent
            </v-icon>
            <v-icon v-else @click="darkMode">mdi-white-balance-sunny</v-icon>
          </template>
          <span>Change theme</span>
        </v-tooltip>
      </v-btn>
      <v-menu
        v-if="isLogged"
        v-model="menu"
        transition="slide-x-transition"
        bottom
        right
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
        rounded="lg"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-card rounded="lg">
          <router-link to="/me" class="routerLink" @click.native="menu = false">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <img :src="loadPhoto(getUser.profile)" alt="John" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ getName }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    getUser.email
                  }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn @click="logout" icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-logout</v-icon>
                      </v-btn>
                    </template>
                    <span>Logout</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </router-link>
          <v-divider></v-divider>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Search from "@/components/shared/Search.vue";
import { mapGetters, mapActions } from "vuex";

export default Vue.extend({
  components: {
    Search,
  },
  data: () => ({
    drawer: false,
    menu: false,
    searchString: "",
    group: "",
  }),
  computed: {
    ...mapGetters("user/", ["isLogged", "getName", "getUser"]),
    ...mapGetters("utils", ["loadPhoto"]),
  },
  methods: {
    ...mapActions("user/", ["logout"]),
    darkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem(
        "is_dark_theme",
        this.$vuetify.theme.dark.toString()
      );
    },
  },
});
</script>

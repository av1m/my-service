<template>
  <div>
    <v-skeleton-loader
      type="list-item-avatar, divider, list-item-three-line, image, article"
      elevation="2"
      v-if="!this.getUser._id"
    ></v-skeleton-loader>
    <div v-else>
      <FloatButton />
      <v-card
        class="mx-auto ma-5 rounded-lg"
        elevation="2"
        max-width="1100"
        outlined
      >
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="headline">
              {{ user.lastname }} {{ user.firstname }}
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
          <v-form ref="form" v-model="validForm" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="user.firstname"
                  label="First Name"
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="user.lastname"
                  label="Last Name"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-text-field
              ref="email"
              v-model="user.email"
              :rules="emailRules"
              label="Email"
              placeholder="john@doe.com"
              prepend-inner-icon="mdi-email-outline"
              required
              outlined
            ></v-text-field>
            <v-snackbar v-model="snackbar" timeout="-1">
              Save your changes ?
              <template v-slot:action="{ attrs }">
                <v-btn
                  color="error"
                  text
                  v-bind="attrs"
                  raised
                  @click="modifyUser"
                  :disabled="!validForm"
                  :block="validForm"
                >
                  Update
                </v-btn>
              </template>
            </v-snackbar>
          </v-form>
          <v-row
            ><v-col cols="12" sm="6">
              <v-text-field
                ref="oldPassword"
                v-model="oldPassword"
                prepend-inner-icon="mdi-lock-open-variant"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[
                  () =>
                    (oldPassword && oldPassword.length >= 8) ||
                    'Password must be more than 8 characters',
                ]"
                :type="show ? 'text' : 'oldPassword'"
                label="Old password"
                hint="At least 8 characters"
                clear-icon="mdi-close-circle"
                counter
                clearable
                outlined
                required
                @click:append="show = !show"
              ></v-text-field> </v-col
            ><v-col cols="12" sm="6">
              <v-text-field
                ref="newPassword"
                v-model="newPassword"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                append-outer-icon="mdi-lock-reset"
                :rules="[
                  () =>
                    (newPassword && newPassword.length >= 8) ||
                    'Password must be more than 8 characters',
                ]"
                :type="show ? 'text' : 'newPassword'"
                label="New password"
                hint="At least 8 characters"
                clear-icon="mdi-close-circle"
                prepend-inner-icon="mdi-lock"
                counter
                clearable
                outlined
                required
                @click:append="show = !show"
                @click:append-outer="changeMyPassword()"
              ></v-text-field> </v-col
          ></v-row>
          <h2 class="pb-5">Services</h2>
          <div v-if="this.user.services.length > 0">
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
            You have not created service yet,
            <router-link to="/add">create one</router-link>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Service from "@/components/Service.vue";
import FloatButton from "@/components/FloatButton.vue";
import { mapActions, mapGetters } from "vuex";
import { IUser, ServiceState, VForm } from "@/store/types";
import { aggregateServices } from "@/plugins/utils";

export default Vue.extend({
  data: () => ({
    user: {} as IUser,
    newPassword: "",
    oldPassword: "",
    show: false,
    validForm: true,
    hover: false,
    emailRules: [
      (v: string) => !!v || "E-mail is required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    snackbar: false,
  }),
  components: {
    Service,
    FloatButton,
  },
  computed: {
    ...mapGetters("user/", ["getUser"]),
    ...mapGetters("utils", ["loadPhoto"]),
    getServices(): ServiceState[] {
      return aggregateServices([this.user]);
    },
    form(): VForm {
      return this.$refs.form as VForm;
    },
  },
  methods: {
    ...mapActions("user", ["changePassword", "updateUser", "loadUser"]),
    changeMyPassword(): void {
      if (this.oldPassword.length < 8 || this.newPassword.length < 8) {
        this.$store.dispatch(
          "alert/error",
          "Thank you for properly entering the old and the new password",
          { root: true }
        );
        return;
      }
      this.changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      });
    },
    modifyUser(): void {
      this.snackbar = false;
      this.updateUser({
        email: this.user.email,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
      });
    },
  },
  watch: {
    getUser() {
      this.user = this.getUser;
      this.$watch("user", () => (this.snackbar = true), { deep: true });
    },
  },
  beforeCreate() {
    const id = this.$store.getters["user/getUser"]._id ?? false;
    if (id) {
      this.$store.dispatch("user/loadUser", {
        id: id,
        update_user: true,
      });
    }
  },
});
</script>

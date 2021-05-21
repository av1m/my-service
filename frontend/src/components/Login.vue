<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="12" sm="1" md="2" lg="3"></v-col>
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card class="rounded-lg">
            <v-card-text>
              <div class="text-center">
                <v-img aspect-ratio="4" src="@/assets/logo.png"></v-img>
              </div>
              <h1>Login</h1>
            </v-card-text>
            <v-card-text>
              <v-text-field
                ref="email"
                v-model="email"
                :rules="emailRules"
                label="Email"
                placeholder="john@doe.com"
                prepend-inner-icon="mdi-email-outline"
                required
                outlined
              ></v-text-field>
              <v-text-field
                ref="password"
                v-model="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[
                  () =>
                    (password && password.length >= 8) ||
                    'Password must be more than 8 characters',
                ]"
                :type="show ? 'text' : 'password'"
                label="Password"
                hint="At least 8 characters"
                prepend-inner-icon="mdi-lock"
                counter
                outlined
                required
                @click:append="show = !show"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-slide-x-reverse-transition>
                <v-tooltip left v-if="!valid">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      class="my-0"
                      v-bind="attrs"
                      @click="resetForm"
                      v-on="on"
                    >
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                  </template>
                  <span>Refresh form</span>
                </v-tooltip>
              </v-slide-x-reverse-transition>
              <v-btn
                color="primary"
                raised
                @click="submit"
                :disabled="!valid"
                :block="valid"
                class="rounded-lg"
              >
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
          <br />
          <v-card rounded="lg">
            <v-card-text class="text-center">
              New to my service?
              <router-link to="/signup"> Create an account </router-link>
            </v-card-text>
          </v-card>
        </v-form>
      </v-col>
      <v-col cols="12" sm="1" md="2" lg="3"></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { VForm } from "@/store/types";
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

export default Vue.extend({
  data: () => ({
    email: null,
    password: null,
    show: false,
    snackbar: false,
    valid: true,
    emailRules: [
      (v: string) => !!v || "E-mail is required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
  }),
  computed: {
    ...mapGetters("user", ["isLogged"]),
    form(): VForm {
      return this.$refs.form as VForm;
    },
  },
  methods: {
    ...mapActions("user", ["login"]),
    resetForm() {
      this.form.reset();
    },
    submit() {
      if (this.form.validate()) {
        this.login({
          email: this.email,
          password: this.password,
        });
      }
    },
  },
  created: function () {
    if (this.isLogged)
      this.$router
        .push("/")
        .catch((err) =>
          this.$store.dispatch(
            "alert/error",
            "Can't redirect the user : " + err
          )
        );
  },
});
</script>

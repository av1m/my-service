<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="12" sm="1" md="2" lg="3"></v-col>
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card class="rounded-lg">
            <v-card-text>
              <div class="text-center">
                <v-img aspect-ratio="4" src="@/assets/logo.svg"></v-img>
              </div>
              <h1>Register</h1>
            </v-card-text>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="firstname"
                    ref="firstname"
                    :rules="nameRules"
                    :counter="10"
                    label="First name"
                    required
                    outlined
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    ref="lastname"
                    v-model="lastname"
                    :rules="nameRules"
                    :counter="10"
                    label="Last name"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-file-input
                show-size
                ref="filephoto"
                v-model="filephoto"
                outlined
                accept="image/*"
                label="Choose a photo for service"
                truncate-length="15"
                prepend-inner-icon="mdi-camera"
                :rules="[
                  (value) =>
                    (filephoto && filephoto.size < 2000000) ||
                    'Photo size should be less than 2 MB!',
                ]"
              ></v-file-input>
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
                @click="submit"
                :disabled="!valid"
                :block="valid"
                depressed
                class="rounded-lg"
              >
                Register
              </v-btn>
            </v-card-actions>
          </v-card>
          <br />
          <v-card rounded="lg">
            <v-card-text class="text-center"
              >Already have an account ?
              <router-link to="/login">Log in</router-link></v-card-text
            >
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
import axios from "axios";
import { upload } from "@/api/users";
import { mapMutations } from "vuex";

export default Vue.extend({
  data: () => ({
    email: "",
    tab: null,
    filephoto: null as null | string | Blob,
    firstname: null,
    lastname: null,
    password: null,
    show: false,
    valid: true,
    emailRules: [
      (v: string) => !!v || "E-mail is required",
      (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    nameRules: [
      (v: string) => !!v || "Name is required",
      (v: string) =>
        (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
  }),

  computed: {
    form(): VForm {
      return this.$refs.form as VForm;
    },
  },

  methods: {
    ...mapMutations("user", ["loginSuccess"]),
    resetForm() {
      this.form.reset();
    },
    submit() {
      if (this.form.validate()) {
        this.register();
      }
    },
    async register() {
      await axios
        .post("http://127.0.0.1:3000/account/register", {
          email: this.email,
          password: this.password,
          firstname: this.firstname,
          lastname: this.lastname,
        })
        .then((res) => {
          // Authenticates the user
          this.loginSuccess(res.data);
          const valid_file =
            (this.$refs.filephoto as VForm)?.validate() ?? false;
          if (valid_file && this.filephoto) {
            const data = new FormData();
            data.append("image", this.filephoto);
            upload(data).then(() => {
              this.$store.dispatch("alert/success", "User created!", {
                root: true,
              });
              this.$router.push("/timeline");
            });
          }
        });
    },
  },
});
</script>

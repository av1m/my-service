<template v-if="isLogged">
  <v-row justify="center">
    <v-dialog
      v-model="show"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="$router.back()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title> New service : {{ name }} </v-toolbar-title>
        </v-toolbar>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">
              Principal information
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="e1 > 2" step="2">
              Adding a photo
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-text-field
                ref="name"
                v-model="name"
                label="Name of the new service"
                placeholder="GitHub's Online Schema Migrations for MySQL"
                prepend-inner-icon="mdi-information"
                class="pt-3"
                counter
                outlined
                required
                :rules="[
                  () =>
                    (name && name.length >= 8) ||
                    'Name must be more than 8 characters',
                ]"
              ></v-text-field>
              <v-textarea
                ref="description"
                name="input-7-4"
                label="Description of the service"
                placeholder="gh-ost is a triggerless online schema migration solution for MySQL. It is testable and provides pausability, dynamic control/reconfiguration, auditing, and many operational perks."
                v-model="description"
                prepend-inner-icon="mdi-text"
                counter
                outlined
                required
                :rules="[
                  () =>
                    (description && description.length >= 15) ||
                    'Description must be more than 15 characters',
                ]"
              ></v-textarea>
              <v-combobox
                v-model="tags"
                :items="tags_items"
                :search-input.sync="search"
                hide-selected
                label="Add some tags"
                multiple
                outlined
                prepend-inner-icon="mdi-tag-multiple"
                counter
                persistent-hint
                small-chips
                required
                :rules="[
                  () =>
                    (tags && tags.length >= 1) ||
                    'You must add at least one tag',
                ]"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        No results matching "<strong>{{ search }}</strong
                        >". Press <kbd>enter</kbd> to create a new one
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-combobox>
              <v-text-field
                ref="price"
                v-model="price"
                type="number"
                label="Price of the new service"
                placeholder="55.5"
                prepend-inner-icon="mdi-currency-eur"
                counter
                outlined
                required
                :rules="[
                  () => (price && price >= 0) || 'Price need to be positive',
                ]"
              ></v-text-field>

              <v-btn color="primary" @click="submit_1" :disabled="!valid">
                Continue
              </v-btn>

              <v-btn text @click="form.reset()"> Cancel </v-btn>
            </v-stepper-content>
            <v-stepper-content step="2">
              <h1>Add a photo to your service</h1>
              <br />
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  ref="urlphoto"
                  v-model="urlphoto"
                  v-if="!filephoto"
                  type="string"
                  label="Enter the URL of the photo"
                  placeholder="https://picsum.photos/1250/400?random=1"
                  prepend-icon="mdi-link"
                  counter
                  outlined
                  :rules="urlphotoRules"
                ></v-text-field>
                <p>Or, You can add an image by uploading it</p>
                <v-file-input
                  show-size
                  ref="filephoto"
                  v-model="filephoto"
                  v-if="!urlphoto"
                  outlined
                  accept="image/*"
                  label="Choose a photo for service"
                  truncate-length="15"
                  prepend-icon="mdi-camera"
                  :rules="[
                    (value) =>
                      (filephoto && filephoto.size < 2000000) ||
                      'Photo size should be less than 2 MB!',
                  ]"
                ></v-file-input>
                <v-btn color="primary" @click="submit_2" :disabled="!valid">
                  Continue
                </v-btn>
                <v-btn color="error" @click="$router.back()" class="ma-2">
                  Don't add a picture
                </v-btn>
              </v-form>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-form>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { VForm } from "@/store/types";
import Vue from "vue";
import { mapGetters, mapState } from "vuex";
import { create, update, upload } from "@/api/services";
import { AxiosResponse } from "axios";
import { validURL } from "@/plugins/utils";

export default Vue.extend({
  data: () => ({
    service: null,
    show: true,
    name: "",
    description: "",
    price: "",
    valid: true,
    tags: [],
    search: null,
    e1: 1,
    urlphoto: null,
    filephoto: null as null | string | Blob,
    urlphotoRules: [
      (v: string) =>
        (v && v.length > 0 && v.startsWith("http") && validURL(v)) ||
        "You must add an url that is a image",
    ],
  }),
  beforeCreate() {
    this.$store.dispatch("service/loadTags");
  },
  components: {},
  computed: {
    ...mapState("service", { tags_items: "tags" }),
    ...mapGetters("user", ["isLogged"]),
    form(): VForm {
      return this.$refs.form as VForm;
    },
  },
  watch: {
    tags(val) {
      if (val.length > 5) {
        this.$nextTick(() => this.tags.pop());
      }
    },
  },
  methods: {
    validURL,
    submit_1() {
      if (this.form.validate()) {
        create({
          name: this.name,
          description: this.description,
          price: Number.parseFloat(this.price),
          tags: this.tags,
        }).then((res) => {
          this.service = res.data;
          this.e1 = 2;
          this.$store.dispatch(
            "alert/success",
            `The service ${this.name} has been created`,
            {
              root: true,
            }
          );
        });
      }
    },
    submit_2(): void {
      const valid_url = (this.$refs.urlphoto as VForm)?.validate() ?? false;
      const valid_file = (this.$refs.filephoto as VForm)?.validate() ?? false;
      const serviceId = (this.service as any).service?._id ?? undefined;
      if (valid_url && this.urlphoto && serviceId) {
        this.redireftAfterSubmit2(
          update(serviceId, { photo: this.urlphoto ?? undefined })
        );
      } else if (valid_file && this.filephoto && serviceId) {
        const data = new FormData();
        data.append("image", this.filephoto);
        this.redireftAfterSubmit2(upload(serviceId, data));
      } else {
        this.$store.dispatch("alert/error", "Can't add the photo", {
          root: true,
        });
      }
    },
    redireftAfterSubmit2(promise: Promise<AxiosResponse>) {
      promise
        .then(() => {
          this.$router.push("/");
          this.$store.dispatch("alert/success", "The photo has been added", {
            root: true,
          });
        })
        .catch(() =>
          this.$store.dispatch("alert/error", "Can't add the photo", {
            root: true,
          })
        );
    },
  },
});
</script>

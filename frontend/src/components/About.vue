<template>
  <div>
    <div v-for="(color, i) in colors" :key="i" class="ma-5">
      <v-card :color="color" class="pl-6">{{ color }}</v-card>
    </div>

    <form enctype="multipart/form-data">
      <input
        type="file"
        accept="image/*"
        @change="uploadImage($event)"
        id="file-input"
        name="picture"
      />
    </form>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-file-input
        ref="filephoto"
        v-model="filephoto"
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
    </v-form>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { upload } from "@/api/services";
import { VForm } from "@/store/types";
import { mapActions } from "vuex";

export default Vue.extend({
  data: () => ({
    filephoto: null as null | string | Blob,
    valid: true,
    colors: [
      "primary",
      "accent",
      "secondary",
      "success",
      "info",
      "warning",
      "error",
      "background",
      "main",
    ],
  }),
  methods: {
    ...mapActions("user/", ["logout"]),
    submit_2() {
      const valid_file = (this.$refs.filephoto as VForm)?.validate() ?? false;
      console.log(this.filephoto);
      console.info(this.$refs);
      const x = false;
      if (x && valid_file && this.filephoto) {
        console.log(this.filephoto);
        let data = new FormData();
        data.append("image", this.filephoto);
        upload("609563dc3d8bd80018cd3a7c", data)
          .then(() => this.$store.commit("alert/success", "Uploaded"))
          .catch(() => this.$store.commit("alert/error", "Cant upload"));
      }
    },
    uploadImage(event: any) {
      let data = new FormData();
      data.append("image", event.target.files[0]);
      upload("609563dc3d8bd80018cd3a7c", data)
        .then(() => this.$store.commit("alert/success", "Uploaded"))
        .catch(() => this.$store.commit("alert/error", "Cant upload"));
    },
  },
});
</script>

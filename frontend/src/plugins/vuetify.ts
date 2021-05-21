import Vue from "vue";
import { colors } from "vuetify/lib";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: "#539BF5",
        accent: "#FF4081",
        secondary: "#ffe18d",
        success: "#4CAF50",
        info: "#EEEEEE",
        warning: "#FB8C00",
        error: "#FF5252",
        background: colors.grey.darken3,
        main: "1E1E1E",
      },
      light: {
        primary: "#0466D6",
        accent: "#e91e63",
        secondary: "#30b1dc",
        success: "#4CAF50",
        info: "#BDBDBD",
        warning: "#FB8C00",
        error: "#FF5252",
        background: "#f0f2f5",
        main: "#FAFAFA",
      },
    },
  },
});

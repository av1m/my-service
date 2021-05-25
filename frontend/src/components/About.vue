<template>
  <div>
    <v-card>
      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
          <v-card-text>
            
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data: () => ({
    show: true,
    loaded: false,
    paidFor: false,
    product: {
      price: 0.1,
      description: "leg lamp from that one movie",
      img: "./assets/lamp.jpg",
    },
  }),
  mounted() {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?currency=EUR&client-id=AbCERCxxsl6xqgDzzBodK2029Cyl5zj5wjqfg4F0P1Ytq44Yn601zJj3G21cxrwKGcuKYWObbwpls51v";
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  methods: {
    setLoaded: function () {
      this.loaded = true;
      (window as any).paypal
        .Buttons({
          createOrder: (data:any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: this.product.description,
                  amount: {
                    currency_code: "EUR",
                    value: this.product.price,
                  },
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log(order);
            this.paidFor = true;
            this.$store.dispatch(
              "alert/success",
              "The payment was successfully completed",
              { root: true }
            );
          },
          onError: (err: any) => {
            this.$store.dispatch(
              "alert/error",
              "An error occurred during payment",
              { root: true }
            );
          },
        })
        .render(this.$refs.paypal);
    },
  },
});
</script>

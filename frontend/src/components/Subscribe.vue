<template>
  <div>
    <!-- 
    <a href="https://www.sandbox.paypal.com/">Sandbox Account</a> <br />
    yafes80645@geekale.com HelloWorld123 <br />
    <a href="https://saijogeorge.com/dummy-credit-card-generator/">Fake Card</a>
    -->
    <div v-if="!isCurrentUser">
      <div class="text-h6 pb-3">
        Subscribe{{ paidFor ? "d" : "" }} to {{ service.name }} -
        {{ service.price }}€
      </div>
      <p>{{ service.description }}</p>
      <div v-if="!paidFor" class="text-center">
        <div ref="paypal"></div>
      </div>
      <div v-if="paidFor">
        <v-alert elevation="3" text type="success">
          Your payment has been registered
        </v-alert>
      </div>
    </div>
    <div v-else>
      <div class="text-h5 pb-3">
        {{ service.name }}
      </div>
      <p>{{ service.description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ServiceState } from "@/store/types";
import { mapActions, mapGetters } from "vuex";

export default Vue.extend({
  props: {
    service: {
      type: Object as () => ServiceState,
    },
  },
  data: () => ({
    loaded: false,
    paidFor: false,
    isCurrentUser: false,
  }),
  computed: {
    ...mapGetters("user", ["belongUserPayment"]),
    ...mapGetters("service", ["belongAuthUser"]),
  },
  methods: {
    ...mapActions("user", ["subscribeService"]),
  },
  created() {
    this.paidFor = this.belongUserPayment(this.service.serviceId);
    this.isCurrentUser = this.belongAuthUser(this.service.serviceId);
  },
  mounted() {
    if (this.paidFor) return;
    this.loaded = true;
    (window as any).paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.service.name,
                amount: {
                  currency_code: "EUR",
                  value: this.service.price,
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          this.subscribeService(this.service.serviceId).then(() => {
            this.paidFor = true;
            this.$store.dispatch(
              "alert/success",
              "The payment was successfully completed",
              { root: true }
            );
          });
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
});
</script>

<template>
  <div>
    <FloatButton />
    <v-row>
      <v-col cols="12" sm="2">
        <v-hover v-slot="{ hover }">
          <v-sheet
            rounded="xl"
            min-height="268"
            :elevation="hover ? 5 : 1"
            style="position: sticky; top: 80px; z-index: 2"
            v-if="false"
          >
          </v-sheet>
        </v-hover>
      </v-col>
      <v-col cols="12" sm="8" class="pt-6">
        <div v-if="!timeline">
          <v-skeleton-loader
            v-for="(n, index) in 3"
            v-bind:key="index"
            elevation="1"
            type="card"
            class="rounded-xl mb-7"
          ></v-skeleton-loader>
        </div>
        <div v-else>
          <v-combobox
            v-model="filterTags"
            :items="tags"
            chips
            clearable
            label="Filter by tags ..."
            multiple
            rounded
            prepend-inner-icon="mdi-filter-variant"
            solo
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                color="primary"
                small
                outlined
                @click="select"
                @click:close="removeTag(item)"
              >
                <v-icon color="primary" left small>mdi-tag-outline</v-icon>
                <strong>&nbsp;{{ item }}</strong>
              </v-chip>
            </template>
          </v-combobox>
          <div v-for="(item, index) in timelineFiltered" :key="index">
            <Service class="mb-7" :item="item"></Service>
          </div>
          <br />
        </div>
      </v-col>
      <v-col cols="12" sm="2">
        <v-hover v-slot="{ hover }">
          <v-sheet
            rounded="xl"
            min-height="268"
            :elevation="hover ? 5 : 1"
            style="position: sticky; top: 80px; z-index: 2"
          >
            <v-list dense rounded color="transparent">
              <v-list-item-content class="text-center">
                <v-list-item-title>
                  <strong>Trends tags&ensp;</strong>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-group>
                <v-list-item
                  v-for="(item, i) in tags.slice(0, 10)"
                  :key="i"
                  v-on:click="addTag(item)"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-trending-up</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-sheet>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Service from "@/components/Service.vue"; // @ is an alias to /src
import { mapState } from "vuex";
import FloatButton from "@/components/FloatButton.vue";

export default Vue.extend({
  components: {
    Service,
    FloatButton,
  },
  async created() {
    this.$store.dispatch("service/loadTimeline");
    this.$store.dispatch("service/loadTags");
  },
  computed: {
    ...mapState("service", ["timeline", "tags"]),
    timelineFiltered: function () {
      return this.timeline.filter((f: any) => {
        if (!Array.isArray(this.filterTags) || !this.filterTags.length)
          return true;
        const intersect = f.tags.filter((t: string) => {
          return this.filterTags.includes(t);
        });
        return intersect?.length;
      });
    },
  },
  watch: {
    filterTags(val) {
      this.timelineFiltered;
    },
  },
  methods: {
    removeTag(item: string): void {
      this.filterTags.splice(this.filterTags.indexOf(item), 1);
      this.filterTags = [...this.filterTags];
    },
    addTag(item: string): void {
      if (!this.filterTags.includes(item)) this.filterTags.push(item);
    },
  },
  data: () => ({
    hover: false,
    tag: null,
    filterTags: [] as string[],
  }),
});
</script>

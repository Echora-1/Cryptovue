<template>
  <section class="relative">
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ tickerName }} - USD
    </h3>
    <div
      class="flex items-end border-gray-600 border-b border-l h-64"
      ref="graph"
    >
      <div
        v-for="(bar, idx) in graph"
        :key="idx"
        :style="{ height: `${bar}%` }"
        class="bg-purple-800 border w-10"
      ></div>
    </div>
    <close-button @click="close" />
  </section>
</template>
<script>
import CloseButton from "./CloseButton";
export default {
  components: { CloseButton },

  props: {
    graph: {
      type: Array,
      default: () => {
        return [];
      }
    },
    tickerName: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      maxGraphElements: 1
    };
  },

  methods: {
    close() {
      this.$emit("close-graph");
    },

    calculateMaxGraphElements() {
      if (!this.$refs.graph) {
        return;
      }
      this.maxGraphElements = this.$refs.graph.clientWidth / 39;
    }
  },

  watch: {
    graph() {
      while (this.graph.length > this.maxGraphElements) {
        // eslint-disable-next-line vue/no-mutating-props
        this.graph.shift();
      }
    },
  },

  mounted() {
    this.$nextTick().then(this.calculateMaxGraphElements);
    window.addEventListener("resize", this.calculateMaxGraphElements);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphElements);
  }
};
</script>

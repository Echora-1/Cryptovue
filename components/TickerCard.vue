<template>
  <div
    @click="selectedTicker"
    :class="{
      'border-4': isSelected,
      'bg-red-300': isInvalid
    }"
    class="overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
  >
    <div class="px-4 py-5 sm:p-6 text-center">
      <dt class="text-sm font-medium text-gray-500 truncate">
        {{ tickerName }} - USD
      </dt>
      <dd class="mt-1 text-3xl font-semibold text-gray-900">
        {{ tickerPrice }}
      </dd>
    </div>
    <div class="w-full border-t border-gray-200"></div>
    <delete-button @click.stop="deleteTicker" />
  </div>
</template>
<script>
import DeleteButton from "./DeleteButton";
export default {
  components: { DeleteButton },

  props: {
    tickerName: {
      type: String,
      default: ""
    },

    tickerPrice: {
      type: Number,
      default: 0
    },

    isInvalid: {
      type: Boolean,
      default: false
    },

    isSelected: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    deleteTicker() {
      this.$emit("delete-ticker");
    },

    selectedTicker() {
      this.$emit("selected-ticker");
    }
  }
};
</script>

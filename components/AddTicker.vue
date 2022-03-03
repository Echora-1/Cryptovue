<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model.trim="ticker"
            @keydown.enter="() => add(ticker)"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
            @input="value => input(value)"
          />
        </div>
        <div>
          <div>
            <span
              class="mx-2 my-2 inline-block cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded-full"
              :key="ticker.Symbol"
              v-for="ticker in similarTicker"
              @click="() => add(ticker.Symbol)"
            >
              {{ ticker.Symbol }}
            </span>
          </div>
          <p class="text-red-600 px-2 py-2" v-show="repeatingTicker">
            Такой тикер уже добавлен
          </p>
        </div>
      </div>
    </div>
    <add-button @click="() => add(ticker)" />
  </section>
</template>

<script>
import AddButton from "./AddButton";
export default {
  components: { AddButton },

  props: {
    repeatingTicker: {
      type: Boolean,
      default: false
    },
    similarTicker: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },

  data() {
    return {
      ticker: ""
    };
  },

  methods: {
    add(tickerName) {
      this.$emit("add-ticker", tickerName);
      this.$nextTick().then(() => {
        if (!this.repeatingTicker) {
          this.ticker = "";
        }
      });
    },

    input() {
      this.$emit("input-ticker", this.ticker);
    }
  }
};
</script>

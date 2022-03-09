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
            class="block w-full text-gray-900 focus:outline-none focus:ring-gray-500 sm:text-sm rounded-md add-input"
            placeholder="Например BTC"
            @input="value => input(value)"
          />
        </div>
        <div>
          <div class="similar-tickers">
            <span
              class="similar-tickers__item"
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
    <add-button class="add-button" @click="() => add(ticker)" />
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

<style lang="scss" scoped>
.add-button {
  margin: 15px 0;
}

.add-input {
  border: 1px solid white;
  &:focus {
    border-color: #9381ff;
  }
}

.similar-tickers {
  margin-top: 15px;
  &__item {
    background-color: #7165be;
    padding: 4px 8px;
    border-radius: 20px;
    color: white;
    transition: background-color 0.5s;
    margin: 5px;
    cursor: pointer;
    display: inline-flex;

    &:hover {
      background-color: #9381ff;
    }
  }
}
</style>

<template>
  <section>
    <div class="add-ticker">
      <div>
        <base-input
          id="ticker"
          placeholder="Например BTC"
          v-model.trim="ticker"
          @keydown.enter="() => add(ticker)"
          label="Тикер"
        />
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
          <p class="add-ticker__error-message" v-show="repeatingTicker">
            Такой тикер уже добавлен
          </p>
        </div>
      </div>
    </div>
    <add-button class="add-ticker__button" @click="() => add(ticker)" />
  </section>
</template>

<script>
import AddButton from "./AddButton";
import BaseInput from "./BaseInput";
export default {
  components: { BaseInput, AddButton },

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

  watch: {
    ticker() {
      this.input();
    }
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
.add-ticker {
  display: flex;

  label {
    font-weight: 500;
    font-size: 0.875rem;
    display: block;
    color: rgba(74, 85, 104, 1);
  }

  &__error-message {
    color: #e53e3e;
    padding: 0.5rem;
  }

  &__button {
    margin: 15px 0;
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

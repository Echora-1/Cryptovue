<template>
  <section>
    <div class="add-ticker">
      <div>
        <label for="ticker">Тикер</label>
        <div class="add-ticker__input-wrap">
          <input
            v-model.trim="ticker"
            @keydown.enter="() => add(ticker)"
            type="text"
            name="ticker"
            id="ticker"
            class="add-ticker__input"
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
.add-ticker {
  display: flex;

  label {
    font-weight: 500;
    font-size: 0.875rem;
    display: block;
    color: rgba(74, 85, 104, 1);
  }

  &__input-wrap {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
    position: relative;
    margin-top: 0.25rem;
    border-radius: 0.375rem;
  }

  &__input {
    border: 1px solid white;
    font-size: 0.875rem;
    width: 100%;
    color: rgba(26, 32, 44, 1);
    border-radius: 0.375rem;
    display: block;

    &:focus {
      border-color: #9381ff;
    }
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

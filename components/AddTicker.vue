<template>
  <section class="add-ticker">
    <div class="add-ticker__main">
      <base-input
        id="ticker"
        placeholder="Например BTC"
        v-model.trim="ticker"
        @keydown.enter="() => add(ticker)"
        label="Тикер"
        class="add-ticker__input"
      />
      <add-button class="add-ticker__button" @click="() => add(ticker)" />
    </div>
    <div class="add-ticker__footer">
      <Transition>
        <div class="similar-tickers" v-if="similarTicker.length">
          <span
            class="similar-tickers__item"
            :key="ticker.Symbol"
            v-for="ticker in similarTicker"
            @click="() => add(ticker.Symbol)"
          >
            {{ ticker.Symbol }}
          </span>
        </div>
      </Transition>
      <Transition>
        <p class="add-ticker__error-message" v-show="repeatingTicker">
          Такой тикер уже добавлен
        </p>
      </Transition>
    </div>
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
  &__main {
    display: flex;
  }

  &__input {
    max-width: 193px;
    margin-bottom: 3px;
  }

  &__error-message {
    color: #e53e3e;
    padding: 6px;
  }

  &__button {
    align-self: flex-end;
    margin-left: 20px;
  }

  &__footer {
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

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

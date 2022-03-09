<template>
  <div class="container mx-auto flex flex-col items-center p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <add-ticker
        @add-ticker="value => add(value)"
        @input-ticker="value => getSimilarCoins(value)"
        :repeatingTicker="repeatingTicker"
        :similarTicker="similarTicker"
      />
      <template v-if="tickers.length">
        <hr />
        <div class="actions">
          <div>
            <label for="filter" class="block text-sm font-medium text-gray-700">
              Фильтр:
            </label>
            <input v-model="filter" id="filter" class="block w-full text-gray-900 focus:outline-none focus:ring-gray-500 sm:text-sm rounded-md my-1 p-1 tickers-filter" />
          </div>
          <div class="pagination">
            <default-button v-if="page > 1" @click="page = page - 1">
              Назад
            </default-button>
            <default-button
              v-if="hasNextPage"
              @click="page = Number.parseInt(page) + 1"
            >
              Вперёд
            </default-button>
          </div>
        </div>
        <hr />
        <div
          class="mt-5 pb-6 grid grid-cols-1 gap-6 sm:grid-cols-3 tickers-list"
        >
          <ticker-card
            v-for="t in paginatedTickers"
            :key="t.name"
            @selected-ticker="select(t)"
            @delete-ticker="handleDelete(t)"
            :ticker-name="t.name"
            :ticker-price="formatPrice(t.price)"
            :is-selected="selectedTicker === t"
            :is-invalid="t.invalid"
          />
        </div>
      </template>
      <ticker-graph
        v-if="selectedTicker"
        :ticker-name="selectedTicker.name"
        :graph="normalizedGraph"
        @close-graph="selectedTicker = null"
      />
    </div>
  </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from "./api";
import AddTicker from "../components/AddTicker";
import TickerGraph from "../components/TickerGraph";
import TickerCard from "../components/TickerCard";
import DefaultButton from "../components/DefaultButton";

export default {
  name: "App",
  components: { DefaultButton, TickerCard, TickerGraph, AddTicker },
  data() {
    return {
      tickers: [],
      selectedTicker: null,
      graph: [],
      page: 1,
      filter: "",
      allCoinsName: "",
      similarTicker: [],
      repeatingTicker: false
    };
  },

  created() {
    this.getAllCoinsName();
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    const VALID_KEYS = ["filter", "page"];

    VALID_KEYS.forEach(key => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    });

    const tickersData = localStorage.getItem("cryptonomicon-list");

    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach(ticker => {
        subscribeToTicker(ticker.name, newPrice =>
          this.updateTicker(ticker.name, newPrice)
        );
      });
    }
  },

  methods: {
    updateTicker(tickerName, price) {
      if (price === "INVALID_SUB") {
        this.tickers = this.tickers.map(ticker => {
          if (ticker.name === tickerName) {
            ticker.invalid = true;
          }
          return ticker;
        });
        return;
      }
      let ticker = this.tickers.find(t => t.name === tickerName);

      if (ticker === this.selectedTicker) {
        this.graph.push(price);
      }
      ticker.price = price;
    },

    async getAllCoinsName() {
      const r = await fetch(
        "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
      );
      const data = await r.json();
      this.allCoinsName = Object.values(data.Data);
    },

    getSimilarCoins(tickerName) {
      this.repeatingTicker = false;
      if (tickerName !== "") {
        let sc = [];
        for (let coin of this.allCoinsName) {
          const isSimilar =
            coin.FullName.toUpperCase().indexOf(tickerName.toUpperCase()) !==
              -1 ||
            coin.Symbol.toUpperCase().indexOf(tickerName.toUpperCase()) !== -1;
          if (isSimilar) {
            sc.push(coin);
          }
          if (sc.length === 4) {
            break;
          }
        }
        this.similarTicker = sc;
      } else {
        this.similarTicker = [];
      }
    },

    formatPrice(price) {
      if (price === "-") {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },

    add(ticker) {
      const currentTicker = {
        name: ticker,
        price: "-",
        invalid: false
      };

      const isNotRecurring =
        this.tickers.filter(item => item.name === currentTicker.name).length ===
        0;

      if (isNotRecurring) {
        this.tickers = [...this.tickers, currentTicker];
        this.filter = "";
        subscribeToTicker(currentTicker.name, newPrice =>
          this.updateTicker(currentTicker.name, newPrice)
        );
      } else {
        this.repeatingTicker = true;
      }
    },

    select(ticker) {
      this.selectedTicker = ticker;
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter(t => t !== tickerToRemove);
      if (tickerToRemove === this.selectedTicker) {
        this.selectedTicker = null;
      }
      unsubscribeFromTicker(tickerToRemove.name);
    }
  },

  computed: {
    startIndex() {
      return (this.page - 1) * 6;
    },

    endIndex() {
      return this.page * 6;
    },

    filteredTickers() {
      return this.tickers.filter(ticker => ticker.name.includes(this.filter));
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },

    normalizedGraph() {
      return this.graph.map(price => parseInt(price));
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      };
    }
  },

  watch: {
    selectedTicker() {
      this.graph = [];
    },

    tickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },

    filter() {
      this.page = 1;
    }
  }
};
</script>

<style lang="scss">
body {
  background-color: #f8f7ff;
}

hr {
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
  width: 100%;
  border-top-width: 1px;
  border-color: #a5a2b8;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
}

.pagination {
  margin: 5px 0;

  & > button {
    margin: 0 5px;
  }
}

.tickers-filter {
  border: 1px solid white;
  &:focus {
    border-color: #9381ff;
  }
}
</style>
<style src="./app.css"></style>

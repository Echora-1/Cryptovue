<template>
  <div class="container cryptovue">
    <div class="container">
      <add-ticker
        @add-ticker="value => add(value)"
        @input-ticker="value => getSimilarCoins(value)"
        :repeatingTicker="repeatingTicker"
        :similarTicker="similarTicker"
      />
      <template v-if="tickers.length">
        <hr />
        <div class="cryptovue__actions">
          <base-input id="filter" label="Фильтр:" v-model="filter" />
          <div class="cryptovue__pagination">
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
        <div class="cryptovue__cards">
          <ticker-card
            v-for="t in paginatedTickers"
            :key="t.name"
            @selected-ticker="select(t)"
            @delete-ticker="handleDelete(t)"
            :ticker-name="getFullNameTicker(t.name)"
            :ticker-price="formatPrice(t.price)"
            :is-selected="selectedTicker === t"
            :is-invalid="t.invalid"
          />
        </div>
      </template>
      <ticker-graph
        v-if="selectedTicker"
        :ticker-name="getFullNameTicker(selectedTicker.name)"
        :graph="normalizedGraph"
        @close-graph="selectedTicker = null"
      />
    </div>
  </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker, getAllTickers } from "./api";
import AddTicker from "../components/AddTicker";
import TickerGraph from "../components/TickerGraph";
import TickerCard from "../components/TickerCard";
import DefaultButton from "../components/DefaultButton";
import { initializeApp } from "firebase/app";
import BaseInput from "../components/BaseInput";

export default {
  name: "App",
  components: {BaseInput, DefaultButton, TickerCard, TickerGraph, AddTicker },
  data() {
    return {
      tickers: [],
      selectedTicker: null,
      graph: [],
      page: 1,
      filter: "",
      tickerNames: [],
      similarTicker: [],
      repeatingTicker: false
    };
  },

  created() {
    const firebaseConfig = {
      apiKey: "AIzaSyC9lu5NhkBhyNVysREs8kdylMG5eD7-vsI",
      authDomain: "cryptovue-3c430.firebaseapp.com",
      projectId: "cryptovue-3c430",
      storageBucket: "cryptovue-3c430.appspot.com",
      messagingSenderId: "63980264713",
      appId: "1:63980264713:web:f3ccd0edd5b9782a2107d8"
    };

    initializeApp(firebaseConfig);

    this.getTickerNames();
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

    async getTickerNames() {
      const allTickers = await getAllTickers();
      this.tickerNames = Object.values(allTickers.Data);
    },

    getSimilarCoins(tickerName) {
      this.repeatingTicker = false;
      if (tickerName !== "") {
        let sc = [];
        for (let coin of this.tickerNames) {
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
      if (ticker === "") {
        return;
      }

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
    },

    getFullNameTicker(tickerName) {
      let fullName = this.tickerNames.find(
        ticker => ticker.Symbol === tickerName
      );
      if (fullName) {
        return fullName.FullName.split(" ")[0]
      } else {
        return tickerName;
      }
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

.cryptovue {
  padding: 1rem;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  align-items: center;
  flex-direction: column;
  display: flex;

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 50px;
  }

  &__pagination {
    margin: 5px 0;

    & > button {
      margin: 0 5px;
    }
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-gap: 1.5rem;
    gap: 1.5rem;
    padding-bottom: 1.5rem;
    margin-top: 1.25rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}
</style>
<style src="./app.css"></style>

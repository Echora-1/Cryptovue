<template>
  <div
    @click="selectedTicker"
    :class="{
      'card--selected': isSelected,
      'card--invalid': isInvalid
    }"
    class="card"
  >
    <div class="card__header">
      <p class="card__name">{{ tickerName }}</p>
      <delete-button @click.stop="deleteTicker" />
    </div>
    <span class="card__currency">$</span>
    <p class="card__price">
      {{ tickerPrice }}
    </p>
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
      type: String,
      default: '0'
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

<style scoped lang="scss">
.card {
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #9381ff;
  border-radius: 10px;
  background: #f8f7ff;
  padding: 14px;
  transition: background-color 0.7s;

  .card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 2px;
    position: relative;
    margin-bottom: 24px;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 14px;
      height: 2px;
      background-color: #7165be;
    }
  }

  .card__name {
    color: #7165be;
    font-weight: bold;
    font-size: 18px;
    line-height: 23px;
    transition: color 0.7s;
  }

  .card__currency {
    font-weight: 500;
    font-size: 30px;
    line-height: 40px;
    color: #9381ff;
    transition: color 0.7s;
  }

  .card__price {
    font-weight: 500;
    font-size: 35px;
    line-height: 45px;
    color: #9381ff;
    letter-spacing: 0.04em;
    transition: all 0.7s;
  }

  &--selected {
    background: linear-gradient(273.78deg, #9381FF 4.51%, #AEA0FF 99.02%);
    border-color: #AEA0FF;
    -webkit-box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
      0 10px 10px rgba(0, 0, 0, 0.22);
    -moz-box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
      0 10px 10px rgba(0, 0, 0, 0.22);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

    & .card__name {
      color: #ffffff;
    }

    & .card__currency {
      color: #ffffff;
    }

    & .card__price {
      color: #ffffff;
    }
  }

  &--invalid {
    background: #ff000087;
  }
}
</style>

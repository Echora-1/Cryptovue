<template>
  <section class="graph">
    <h3>{{ tickerName }} - USD</h3>
    <apexcharts
      width="100%"
      height="350"
      type="area"
      :options="chartOptions"
      :series="series"
      ref="graph"
    ></apexcharts>
    <close-button class="close-button" @click="close" />
  </section>
</template>
<script>
import CloseButton from "./CloseButton";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: { CloseButton, apexcharts: VueApexCharts },

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
      series: [
        {
          name: "USD",
          data: []
        }
      ],
      chartOptions: {
        chart: {
          type: "area",
          height: 350,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        colors: ["#7165be", "#9381ff"],
        markers: {
          size: 0,
          style: "hollow"
        },
        stroke: {
          curve: "smooth"
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          tooltip: {
            enabled: false
          }
        },
      }
    };
  },

  methods: {
    close() {
      this.$emit("close-graph");
    }
  },

  watch: {
    graph() {
      this.series = [
        {
          name: "USD",
          data: this.graph
        }
      ];
    }
  },
};
</script>

<style lang="scss" scoped>
.graph {
  position: relative;

  h3 {
    color: #352E5B;
    margin: 25px 0;
    font-weight: bold;
    font-size: 20px;
    line-height: 150%;
    letter-spacing: 0.1px;
  }
}

.close-button {
  position: absolute;
  right: 0;
  top: 0;
}
</style>

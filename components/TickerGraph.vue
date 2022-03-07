<template>
  <section class="relative">
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ tickerName }} - USD
    </h3>
    <apexcharts
      width="100%"
      height="350"
      type="area"
      :options="chartOptions"
      :series="series"
      ref="graph"
    ></apexcharts>
    <close-button @click="close" />
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

  watch: {
    graph() {
      this.$refs.graph.updateSeries([
        {
          data: this.graph
        }
      ]);
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
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
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
        }
      }
    };
  },

  methods: {
    close() {
      this.$emit("close-graph");
    }
  }
};
</script>

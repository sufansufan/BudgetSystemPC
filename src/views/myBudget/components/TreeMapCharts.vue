<template>
  <div ref="treeMap" class="tree-map"/>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/treemap'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'TreeMap',
  props: {
    id: {
      type: String,
      default: ''
    },
    chartData: {
      type: Array,
      default: () => []
    },
    date: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      myChart: null
    }
  },
  watch: {
    chartData: {
      handler() {
        this.setChartData(this.chartData)
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    initChart() {
      this.myChart = echarts.init(this.$refs.treeMap, 'light')
    },
    setChartData(data) {
      var formatUtil = echarts.format

      function getLevelOption() {
        return [
          {
            itemStyle: {
              normal: {
                borderWidth: 0,
                gapWidth: 5
              }
            }
          },
          {
            itemStyle: {
              normal: {
                gapWidth: 1
              }
            }
          },
          {
            colorSaturation: [0.35, 0.5],
            itemStyle: {
              normal: {
                gapWidth: 1,
                borderColorSaturation: 0.6
              }
            }
          }
        ]
      }

      this.myChart.setOption({
        title: {
          text: this.date,
          left: 'center'
        },

        tooltip: {
          formatter(info) {
            var value = info.value
            var treePathInfo = info.treePathInfo
            var treePath = []
            for (var i = 1; i < treePathInfo.length; i++) {
              treePath.push(treePathInfo[i].name)
            }
            return [
              '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
              '￥: ' + value + ' 元'
            ].join('')
          }
        },
        series: [
          {
            name: this.date,
            type: 'treemap',
            visibleMin: 300,
            label: {
              show: true,
              formatter: '{b}'
            },
            itemStyle: {
              normal: {
                borderColor: '#fff'
              }
            },
            levels: getLevelOption(),
            data
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.tree-map {
  height: 700px;
}
</style>

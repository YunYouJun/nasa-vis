<template>
  <v-card :loading="loading">
    <v-card-title class="title">
      {{ $t('asteroids.number-of-neos') }}
    </v-card-title>
    <v-card-text>
      <v-checkbox
        v-model="descending"
        :label="$t('asteroids.descending')"
        :off-icon="svgPaths.mdiCheckboxBlankOutline"
        :on-icon="svgPaths.mdiCheckboxMarked"
        @click="updateBarChart"
      ></v-checkbox>
      <div id="bar-chart-container"></div>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mdiCalendar,
  mdiCalendarRange,
  mdiCalendarSearch,
  mdiChevronUp,
  mdiChevronDown,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiDatabaseSearch,
} from '@mdi/js'
import * as d3 from 'd3'
export default {
  props: {
    loading: Boolean,
    neos: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data: () => ({
    svgPaths: {
      mdiCalendar,
      mdiCalendarRange,
      mdiCalendarSearch,
      mdiChevronUp,
      mdiChevronDown,
      mdiCheckboxBlankOutline,
      mdiCheckboxMarked,
      mdiDatabaseSearch,
    },
    descending: false,
    mockData: [
      { date: '2020-01-02', count: 22 },
      { date: '2020-25-29', count: 10 },
      { date: '2020-30-34', count: 39 },
      { date: '2020-40-44', count: 28 },
      { date: '2020-55-59', count: 17 },
      { date: '2020-65-69', count: 26 },
      { date: '2020-70-74', count: 21 },
    ],
  }),
  watch: {
    neos(val, oldVal) {
      if (val.length === 0 && oldVal.length === 0) return
      const data = Array.from(this.neos)

      if (oldVal.length === 0) {
        this.barChart = this.drawBarChart(data)
      } else {
        this.barChart.update(data)
      }
    },
  },
  methods: {
    drawBarChart(barChartData) {
      const barHeight = 30
      const margin = {
        top: 20,
        left: 0,
        bottom: 0,
        right: 0,
      }
      const width = 500
      const height = margin.top + barHeight * barChartData.length

      const svg = d3
        .select('#bar-chart-container')
        .append('svg')
        .attr('id', 'bar-chart')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('height', height)
        .append('g')

      const xMax = d3.max(barChartData, (d) => d.count)
      const xScale = d3
        .scaleLinear()
        .domain([0, xMax])
        .rangeRound([margin.left, width - margin.right])
      const yScale = d3
        .scaleBand()
        .domain(barChartData.map((d) => d.date))
        .rangeRound([margin.top, height])
        .paddingInner(0.2)

      const color = d3
        .scaleSequential()
        .domain([0, xMax])
        .interpolator(d3.interpolateBlues)

      let bar = svg
        .append('g')
        .style('fill', 'dodgerblue')
        .join('g')
        .selectAll('rect')
        .data(barChartData)
        .join('rect')
        .style('mix-blend-mode', 'multiply')
        .attr('fill', (d) => color(d.count))
        .attr('x', xScale(0))
        .attr('y', (d) => yScale(d.date))
        .attr('width', (d) => xScale(d.count))
        .attr('height', yScale.bandwidth() - 1)

      const xAxis = (g, x) =>
        g
          .attr('transform', `translate(0,${margin.top})`)
          .call(d3.axisTop(x).ticks(xMax))
          .call((g) =>
            (g.selection ? g.selection() : g).select('.domain').remove()
          )
      const gx = svg.append('g').call(xAxis, xScale)
      gx.selectAll('text').attr('font-size', '0.9rem')

      const yAxis = (g, y) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).tickSizeOuter(0))
      const gy = svg.append('g').call(yAxis, yScale)
      gy.selectAll('text').attr('font-size', '0.9rem')

      return Object.assign(svg.node(), {
        update(data) {
          const t = svg.transition().duration(750)

          gx.transition(t).call(xAxis, xScale.domain([0, xMax]))
          gy.transition(t).call(yAxis, yScale.domain(data.map((d) => d.date)))

          bar = bar
            .data(data, (d) => d.date)
            .join(
              (enter) =>
                enter
                  .append('rect')
                  .style('mix-blend-mode', 'multiply')
                  .attr('class', 'bar')
                  .attr('fill', (d) => color(d.count))
                  .attr('x', xScale(0))
                  .attr('y', (d) => yScale(d.date))
                  .attr('width', (d) => xScale(d.count))
                  .attr('height', yScale.bandwidth() - 1),
              (update) =>
                update
                  .attr('height', yScale.bandwidth() - 1)
                  .attr('fill', (d) => color(d.count)),
              (exit) =>
                exit.call((bar) =>
                  bar
                    .transition()
                    .duration(600)
                    .remove()
                    .attr('x', (d) => -xScale(d.count))
                    .style('opacity', 0)
                )
            )
            .call((bar) =>
              bar
                .transition(t)
                .attr('width', (d) => xScale(d.count))
                .attr('y', (d) => yScale(d.date))
            )
        },
      })
    },
    updateBarChart() {
      if (this.descending) {
        this.neos.sort((a, b) => d3.descending(a.count, b.count))
      } else {
        this.neos.sort((a, b) => {
          return new Date(a.date) > new Date(b.date) ? -1 : 1
        })
      }
    },
  },
}
</script>

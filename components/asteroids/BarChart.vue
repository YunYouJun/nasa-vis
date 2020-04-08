<template>
  <div>
    <v-row>
      <v-col cols="12" sm="4">
        <v-date-picker
          v-model="dates"
          range
          width="100%"
          :allowed-dates="allowedDates"
          @change="getNeoFeedByDate"
        ></v-date-picker>
      </v-col>
      <v-col cols="12" sm="8" class="px-0">
        <v-col cols="12">
          <v-text-field
            v-model="dateRangeText"
            label="Date range"
            :prepend-icon="svgPaths.mdiCalendarRange"
            readonly
            hide-details
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="pt-0">
          <v-card class="mx-auto">
            <v-img
              src="https://i.loli.net/2020/04/08/djXSl754vCUTzIK.png"
              height="217px"
            ></v-img>

            <v-card-title class="subtitle-1 py-1">
              Near Earth Objects (Neo)
            </v-card-title>

            <v-card-actions class="py-0">
              <v-card-subtitle class="headline">
                {{ element_count }}
              </v-card-subtitle>

              <v-spacer></v-spacer>

              <v-btn icon @click="show = !show">
                <v-icon>{{
                  (show ? svgPaths.mdiChevronUp : svgPaths.mdiChevronDown)
                }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="show">
                <v-divider></v-divider>

                <v-card-text>
                  近地小行星（near-Earth
                  asteroids，NEAs）指的是轨道与地球轨道相交的小行星。这类小行星可能会带来撞击地球的危险。
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="title">
            Number Of Neos
          </v-card-title>
          <v-card-text>
            <div id="bar-chart-container"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mdiCalendarRange, mdiChevronUp, mdiChevronDown } from '@mdi/js'
import { timeFormat } from 'd3-time-format'
import * as d3 from 'd3'
const parseDate = (string) => timeFormat('%Y-%m-%d')(string)
const today = new Date()
const lastWeek = new Date().setDate(today.getDate() - 6)
export default {
  data: () => ({
    dates: [parseDate(lastWeek), parseDate(today)],
    svgPaths: {
      mdiCalendarRange,
      mdiChevronUp,
      mdiChevronDown,
    },
    show: false,
    element_count: 0,
    neos: {},
  }),
  computed: {
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
  },
  mounted() {
    this.getNeoFeedByDate()
    this.drawBarChart(this.prepareBarChartData(this.neos))
  },
  methods: {
    async getNeoFeedByDate() {
      const data = await this.$axios.$get('/neo/rest/v1/feed', {
        params: {
          start_date: this.dates[0],
          end_date: this.dates[1],
        },
      })
      this.element_count = data.element_count
      this.neos = data.near_earth_objects
      this.drawBarChart(this.prepareBarChartData(this.neos))
    },
    getDayFromString(string) {
      return parseInt(string.split('-')[2])
    },
    allowedDates(val) {
      if (this.dates.length === 2) {
        return true
      }
      return (
        this.getDayFromString(val) > this.getDayFromString(this.dates[0]) - 7 &&
        this.getDayFromString(val) < this.getDayFromString(this.dates[0]) + 7
      )
    },
    drawBarChart(barChartData) {
      d3.selectAll('svg').remove()
      const width = 500
      const height = 200
      const xMax = d3.max(barChartData, (d) => d.number)

      const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width])
      const yScale = d3
        .scaleBand()
        .domain(barChartData.map((d) => d.date))
        .rangeRound([20, height])
        .paddingInner(0.25)

      const svg = d3
        .select('#bar-chart-container')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('height', height)
        .append('g')

      svg
        .append('g')
        .attr('class', 'bars')
        .selectAll('.bar')
        .data(barChartData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', (d) => yScale(d.date))
        .attr('width', (d) => xScale(d.number))
        .attr('height', yScale.bandwidth())
        .style('fill', 'dodgerblue')

      // Draw x axis.
      const xAxis = d3
        .axisTop(xScale)
        .ticks(xMax)
        .tickSizeInner(-height)
        .tickSizeOuter(0)
      const xAxisDraw = svg.append('g').attr('class', 'x axis').call(xAxis)
      xAxisDraw.selectAll('text').attr('dy', '1rem').attr('font-size', '0.9rem')

      // Draw y axis.
      const yAxis = d3.axisLeft(yScale).tickSize(0)

      const yAxisDraw = svg.append('g').attr('class', 'y axis').call(yAxis)
      yAxisDraw
        .selectAll('text')
        .attr('dx', '-0.6em')
        .attr('font-size', '0.9rem')
    },
    prepareBarChartData(data) {
      const dataArray = []
      for (const key in data) {
        dataArray.push({
          date: key,
          number: data[key].length,
        })
      }

      return dataArray.sort((a, b) => d3.descending(a.number, b.number))
    },
  },
}
</script>

<style>
svg {
  width: 100%;
}

.axis .domain {
  stroke: none;
}

.x .tick line {
  stroke: white;
}
</style>

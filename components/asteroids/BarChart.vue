<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="5">
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="start_date"
                  label="Start Date"
                  :prepend-icon="svgPaths.mdiCalendar"
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="start_date"
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="5">
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="end_date"
                  label="End Date"
                  :prepend-icon="svgPaths.mdiCalendarRange"
                  readonly
                  dense
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="end_date"
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="2" class="text-center pa-0">
            <v-btn class="mx-2" fab dark color="indigo" @click="searchNEOs">
              <v-icon dark>{{ svgPaths.mdiCalendarSearch }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
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
                <v-row
                  ><v-col cols="12" sm="6">
                    <v-img
                      src="https://i.loli.net/2020/04/08/djXSl754vCUTzIK.png"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" sm="6">
                    数据来源：NASA（National Aeronautics and Space
                    Administration），美国国家航空航天局。
                    <hr class="my-2" />
                    Data-set: All the data is from the NASA JPL Asteroid team
                    (http://neo.jpl.nasa.gov/).
                    <hr class="my-1" style="opacity: 0.3;" />
                    NeoWs (Near Earth Object Web Service) is a RESTful web
                    service for near earth Asteroid information. With NeoWs a
                    user can: search for Asteroids based on their closest
                    approach date to Earth, lookup a specific Asteroid with its
                    NASA JPL small body id, as well as browse the overall
                    data-set.
                    <hr class="my-2" />
                    近地天体 （near-Earth object,
                    NEO）为太阳系内其轨道接近地球的天体。所有近地天体的轨道近日点都小于1.3天文单位，它们包括数以千计的近地小行星、接近的彗星、和大到在撞击到地球之前还在太空时就能够被监测的流星体。
                    <hr class="my-2" />
                    潜在危险天体（potentially hazardous
                    object，PHO）是指轨道有撞击地球的可能，且其大小足以对地球造成全球或局部区域重大损害的近地天体
                    －无论是小行星或彗星。
                    多数这类天体是潜在危险小行星（potentially hazardous
                    asteroids，PHAs），其定义为与地球的最小轨道交点距离少于0.05天文单位（19.5月距），并且绝对星等亮达22等或更亮。
                    <hr class="my-2" />
                    2009 年印度尼西亚事件中，直径约 10 米的小行星便释放出约 2
                    倍于广岛原子弹。
                    著名的白垩纪-第三纪灭绝事件与通古斯大爆炸均推测为天体引发的撞击事件。
                  </v-col>
                  <v-col cols="12"
                    >数据结论：只有一小部分近地行星的运动轨迹可能对地球产生威胁，最终实际威胁到地球的情况微乎其微。地球末日很难到来，我们仍旧应当珍惜现有的生活。我们一日日度过的所谓日常，实际上可能是接连不断的奇迹。</v-col
                  >
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col></v-row
    >
    <v-row>
      <v-col cols="12">
        <v-card :loading="loading">
          <v-card-title class="title">
            Number Of Neos
          </v-card-title>
          <v-card-text>
            <v-checkbox
              v-model="descending"
              :label="`Descending`"
              :off-icon="svgPaths.mdiCheckboxBlankOutline"
              :on-icon="svgPaths.mdiCheckboxMarked"
              @click="updateBarChart"
            ></v-checkbox>
            <div id="bar-chart-container"></div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card :loading="loading">
          <v-card-title class="title">
            Pie Of Neos with PHAs
          </v-card-title>
          <v-card-text>
            <div id="pie-chart-container"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" color="red" top>
      {{ tooltip }}
      <v-btn text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
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
} from '@mdi/js'
import { timeFormat } from 'd3-time-format'
import * as d3 from 'd3'
const parseDate = (string) => timeFormat('%Y-%m-%d')(string)
const today = new Date()
const lastWeek = new Date().setDate(today.getDate() - 6)
export default {
  data: () => ({
    firstSearch: true,
    menu1: false,
    menu2: false,
    start_date: parseDate(lastWeek),
    end_date: parseDate(today),
    svgPaths: {
      mdiCalendar,
      mdiCalendarRange,
      mdiCalendarSearch,
      mdiChevronUp,
      mdiChevronDown,
      mdiCheckboxBlankOutline,
      mdiCheckboxMarked,
    },
    show: false,
    element_count: 0,
    neos: {},
    descending: false,
    snackbar: false,
    tooltip: '由于 API 限制，开始日期与结束日期之差不能超过一周！',
    loading: false,
    data: [
      { date: '2020-01-02', count: 22 },
      { date: '2020-25-29', count: 10 },
      { date: '2020-30-34', count: 39 },
      { date: '2020-40-44', count: 28 },
      { date: '2020-55-59', count: 17 },
      { date: '2020-65-69', count: 26 },
      { date: '2020-70-74', count: 21 },
    ],
  }),
  methods: {
    async searchNEOs() {
      if (this.firstSearch) {
        this.firstSearch = false
        await this.getNeoFeedByDate()
        this.drawBarChartByData()
        this.drawPieChartByData()
      } else {
        this.updateBarChartByFeed()
      }
    },
    async updateBarChartByFeed() {
      if (this.isAllowedDate(this.start_date, this.end_date)) {
        await this.getNeoFeedByDate()
        this.updateBarChart()
      } else {
        this.snackbar = true
      }
    },
    async getNeoFeedByDate() {
      this.loading = true
      const data = await this.$axios.$get('/neo/rest/v1/feed', {
        params: {
          start_date: this.start_date,
          end_date: this.end_date,
        },
      })
      this.loading = false

      this.element_count = data.element_count
      this.neos = data.near_earth_objects
    },
    getDayFromString(string) {
      return parseInt(string.split('-')[2])
    },
    isAllowedDate(startDate, endDate) {
      return (
        this.getDayFromString(startDate) > this.getDayFromString(endDate) - 7 &&
        this.getDayFromString(startDate) < this.getDayFromString(endDate) + 7
      )
    },
    drawBarChartByData() {
      this.barChartData = this.prepareBarChartData(this.neos, this.descending)
      this.barChart = this.drawBarChart(this.barChartData)
    },
    drawPieChartByData() {
      this.pieChart = this.drawPieChart(this.barChartData)
    },
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
      this.barChartData = this.prepareBarChartData(this.neos, this.descending)
      this.barChart.update(this.barChartData)
    },
    prepareBarChartData(data, descending) {
      const dataArray = []
      for (const key in data) {
        let PHAs = 0
        data[key].forEach((neo) => {
          if (neo.is_potentially_hazardous_asteroid) {
            PHAs++
          }
        })
        dataArray.push({
          date: key,
          count: data[key].length,
          PHAs,
        })
      }

      if (descending) {
        return dataArray.sort((a, b) => d3.descending(a.count, b.count))
      } else {
        return dataArray.sort((a, b) => {
          return new Date(a.date) > new Date(b.date) ? -1 : 1
        })
      }
    },
    drawPieChart(data) {
      const width = 500
      const height = 500
      const innerRadius = 0
      const outerRadiusRatio = 15

      const arc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius((d) => d.data.count * outerRadiusRatio)

      // .outerRadius(Math.min(width, height) / 2 - 1)

      const phaArc = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius((d) => d.data.PHAs * outerRadiusRatio)

      const arcLabel = d3
        .arc()
        .innerRadius((d) => d.data.count * outerRadiusRatio * 0.8)
        .outerRadius((d) => d.data.count * outerRadiusRatio * 0.8)

      const phaArcLabel = d3
        .arc()
        .innerRadius((d) => d.data.PHAs * outerRadiusRatio * 0.8)
        .outerRadius((d) => d.data.PHAs * outerRadiusRatio * 0.8)

      const pie = d3
        .pie()
        .sort(null)
        .value((d) => d.count)

      const color = d3
        .scaleOrdinal()
        .domain(data.map((d) => d.date))
        .range(
          d3
            .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
            .reverse()
        )

      const arcs = pie(data)

      const svg = d3
        .select('#pie-chart-container')
        .append('svg')
        .attr('id', 'bar-chart')
        .attr('viewBox', [-width / 2, -height / 2, width, height])
        .attr('height', 500)

      svg
        .append('g')
        .attr('stroke', 'white')
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('fill', (d) => color(d.data.date))
        .attr('d', arc)
        .append('title')
        .text((d) => `${d.data.date}: ${d.data.PHAs.toLocaleString()}`)

      // PHAs
      svg
        .append('g')
        .attr('stroke', 'white')
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('fill', '#F44336')
        .attr('d', phaArc)
        .append('title')
        .text((d) => `${d.data.date}: ${d.data.count.toLocaleString()}`)

      // label
      svg
        .append('g')
        .attr('text-anchor', 'middle')
        .selectAll('text')
        .data(arcs)
        .join('text')
        .attr('transform', (d) => `translate(${arcLabel.centroid(d)})`)
        .call((text) =>
          text
            .append('tspan')
            .attr('y', '-0.2rem')
            .attr('font-weight', 'bold')
            .text((d) => d.data.date)
        )
        .call((text) =>
          text
            .filter((d) => d.endAngle - d.startAngle > 0.25)
            .append('tspan')
            .attr('x', 0)
            .attr('y', '1rem')
            .attr('fill-opacity', 0.7)
            .text((d) => d.data.count.toLocaleString())
        )

      svg
        .append('g')
        .attr('text-anchor', 'middle')
        .selectAll('text')
        .data(arcs)
        .join('text')
        .attr('transform', (d) => `translate(${phaArcLabel.centroid(d)})`)
        .call((text) =>
          text
            .append('tspan')
            .attr('font-size', '12px')
            .attr('fill', 'white')
            .text((d) => d.data.PHAs)
        )

      return svg.node()
    },
  },
}
</script>

<style>
svg {
  width: 100%;
}

text {
  font-family: Roboto, 'PingFang SC', 'Mircosoft YaHei', Consolas, Monaco,
    'Courier New', Courier, monospace;
}
</style>

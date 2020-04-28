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
                  :label="$t('asteroids.start-date')"
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
                  :label="$t('asteroids.end-date')"
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
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="indigo"
              @click="searchNEOs"
            >
              <v-icon dark>{{ svgPaths.mdiCalendarSearch }}</v-icon>
            </v-btn>
            <v-btn
              class="mx-2"
              color="primary"
              fab
              dark
              small
              @click="searchDatabase"
            >
              <v-icon dark>{{ svgPaths.mdiDatabaseSearch }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <neo-info :element-count="element_count"></neo-info>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12"
        ><bar-chart :loading="loading" :neos="neos"></bar-chart
      ></v-col>
      <v-col cols="12">
        <pie-chart :loading="loading" :neos="neos"></pie-chart>
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
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiDatabaseSearch,
} from '@mdi/js'
import { timeFormat } from 'd3-time-format'
import NeoInfo from '~/components/asteroids/NeoInfo.vue'
import BarChart from '~/components/asteroids/BarChart.vue'
import PieChart from '~/components/asteroids/PieChart.vue'

const parseDate = (string) => timeFormat('%Y-%m-%d')(string)
const today = new Date()
const lastWeek = new Date().setDate(today.getDate() - 6)
export default {
  components: {
    NeoInfo,
    BarChart,
    PieChart,
  },
  data() {
    return {
      neos: [],
      firstSearch: true,
      element_count: 0,
      start_date: parseDate(lastWeek),
      end_date: parseDate(today),
      menu1: false,
      menu2: false,
      snackbar: false,
      tooltip: '由于 API 限制，开始日期与结束日期之差不能超过一周！',
      loading: false,
      svgPaths: {
        mdiCalendar,
        mdiCalendarRange,
        mdiCalendarSearch,
        mdiCheckboxBlankOutline,
        mdiCheckboxMarked,
        mdiDatabaseSearch,
      },
    }
  },

  methods: {
    async searchDatabase() {
      this.loading = true
      const neos = await this.getNeosFeedByDatabase(
        this.start_date,
        this.end_date
      )
      this.neos = neos
      this.loading = false
    },
    async getNeosFeedByDatabase(startDate, endDate) {
      const startDateQuery = new this.$AV.Query('NEO')
      startDateQuery.greaterThanOrEqualTo('date', new Date(startDate))
      const endDateQuery = new this.$AV.Query('NEO')
      endDateQuery.lessThanOrEqualTo('date', new Date(endDate))

      const query = this.$AV.Query.and(startDateQuery, endDateQuery)
      const neos = []
      await query.find().then((data) => {
        data.forEach((d) => {
          neos.push({
            date: parseDate(d.attributes.date),
            count: d.attributes.count,
            PHAs: d.attributes.PHAs,
          })
        })
      })
      return neos
    },
    async searchNEOs() {
      this.loading = true
      if (this.isAllowedDate(this.start_date, this.end_date)) {
        const data = await this.getNeoFeedByDate()
        this.element_count = data.element_count
        this.neos = this.prepareChartData(data.near_earth_objects)
      } else {
        this.snackbar = true
      }

      this.loading = false
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
    async getNeoFeedByDate() {
      const data = await this.$axios.$get('/neo/rest/v1/feed', {
        params: {
          start_date: this.start_date,
          end_date: this.end_date,
        },
      })
      return data
    },
    prepareChartData(data) {
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

      return dataArray.sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? -1 : 1
      })
    },
  },
  head() {
    return { title: this.$t('asteroids.title') }
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

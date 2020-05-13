<template>
  <v-row>
    <v-col cols="12" md="3" class="text-center">
      <v-date-picker
        v-model="date"
        :first-day-of-week="0"
        :locale="this.$store.state.locale"
        @change="getEpicByDate(date)"
      ></v-date-picker>
    </v-col>
    <v-col cols="12" md="9" class="text-center">
      <v-card class="pa-2">
        <v-switch
          v-model="colorful"
          label="With Color"
          @change="renderEarth"
        ></v-switch>
        <div id="map-container" class="text-center"></div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import { geoInertiaDrag } from 'd3-inertia'
const sphere = { type: 'Sphere' }
const projection = d3.geoOrthographic()
export default {
  data() {
    return {
      date: null,
      colorful: false,
      width: 0,
      height: 0,
      address: [],
      beijing: [116.3, 39.9],
    }
  },
  mounted() {
    this.setDefaultDate()
    this.height = this.getHeight()
    this.width = this.height
    this.drawChart()
    this.getEpicByDate(this.date)
  },
  methods: {
    setDefaultDate() {
      const date = new Date()
      date.setDate(date.getDate() - 3)
      const day = d3.timeFormat('%Y-%m-%d')(date)
      this.date = day
    },
    // refer d3-inertia demo
    // https://github.com/Fil/d3-inertia
    getEpicByDate(date) {
      this.$axios.$get('/EPIC/api/natural/date/' + date).then((data) => {
        this.address = []
        data.forEach((d) => {
          const coordinates = [
            d.centroid_coordinates.lon,
            d.centroid_coordinates.lat,
          ]
          this.address.push(coordinates)
        })
      })

      this.renderEarth()
    },
    renderEarth() {
      const width = this.width
      const height = this.height

      const land = this.land
      const countries = this.countries

      const context = this.context
      const path = this.path

      context.clearRect(0, 0, width, height)
      context.fillStyle = 'black'

      const graticule = d3.geoGraticule()
      context.beginPath()
      context.strokeStyle = 'rgba(0, 0, 0, 0.08)'
      path(graticule())
      context.stroke()

      const colorScale = d3.scaleOrdinal(d3.schemePaired)
      if (this.colorful) {
        countries.forEach((country) => {
          context.beginPath()
          const curColor = d3.color(colorScale(country.id))
          curColor.opacity = 0.9
          context.fillStyle = curColor + ''
          path(country)
          context.fill()
        })
      } else {
        context.beginPath()
        path(land)
        context.fill()
      }

      // border
      context.strokeStyle = 'black'
      context.beginPath()
      path({ type: 'Sphere' })
      context.lineWidth = 1
      context.strokeStyle = 'rgba(0, 0, 0, 0.08)'
      context.stroke()

      const p = projection.rotate().map((d) => Math.floor(10 * d) / 10)
      context.fillText(`λ = ${p[0]}, φ = ${p[1]}, γ = ${p[2]}`, 10, 10)

      // point
      this.address.forEach((pos) => {
        context.beginPath()
        context.fillStyle = this.colorful ? 'black' : 'red'
        path({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: pos },
        })
        context.fill()
      })
    },
    drawChart() {
      const width = this.width
      const height = this.height

      const canvas = d3
        .select('#map-container')
        .append('canvas')
        .attr('width', width)
        .attr('height', height)

      const context = canvas.node().getContext('2d')
      const path = d3.geoPath().projection(projection).context(context)
      this.context = context
      this.path = path

      let render = function () {}
      d3.json(
        'https://cdn.jsdelivr.net/npm/world-atlas@latest/world/110m.json'
      ).then((world) => {
        const land = topojson.feature(world, world.objects.land)
        const countries = topojson.feature(world, world.objects.countries)
          .features
        this.land = land
        this.countries = countries

        projection.rotate([30, -30])

        render = () => {
          this.renderEarth()
        }

        render()
      })

      geoInertiaDrag(
        canvas,
        function () {
          render()
        },
        projection
      )
    },
    getHeight() {
      const width = 500
      const [[x0, y0], [x1, y1]] = d3
        .geoPath(projection.fitWidth(width, sphere))
        .bounds(sphere)
      const dy = Math.ceil(y1 - y0)
      const l = Math.min(Math.ceil(x1 - x0), dy)
      projection.scale((projection.scale() * (l - 1)) / l).precision(0.2)
      return dy
    },
  },
  head() {
    return { title: this.$t('epic.title') }
  },
}
</script>

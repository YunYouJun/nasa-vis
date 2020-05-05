<template>
  <v-card class="pa-2">
    <v-switch v-model="color" label="With Color"></v-switch>
    <div id="map-container" class="text-center"></div>
  </v-card>
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
      color: false,
      width: 0,
      height: 0,
      address: [],
      beijing: [116.3, 39.9],
    }
  },
  mounted() {
    this.getTodayEPIC()
    this.height = this.getHeight()
    this.width = this.height
    this.drawChart()
  },
  methods: {
    // refer d3-inertia demo
    // https://github.com/Fil/d3-inertia
    getTodayEPIC() {
      const date = new Date()
      date.setDate(date.getDate() - 2)
      const day = d3.timeFormat('%Y-%m-%d')(date)
      this.$axios.$get('EPIC/api/natural/date/' + day).then((data) => {
        data.forEach((d) => {
          const coordinates = [
            d.centroid_coordinates.lon,
            d.centroid_coordinates.lat,
          ]
          this.address.push(coordinates)
        })
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
      const color = d3.scaleOrdinal(d3.schemePaired)

      let render = function () {}
      d3.json(
        'https://cdn.jsdelivr.net/npm/world-atlas@latest/world/110m.json'
      ).then((world) => {
        const land = topojson.feature(world, world.objects.land)
        const countries = topojson.feature(world, world.objects.countries)
          .features

        projection.rotate([30, -30])

        render = () => {
          context.clearRect(0, 0, width, height)
          context.fillStyle = 'black'

          const graticule = d3.geoGraticule()
          context.beginPath()
          context.strokeStyle = 'rgba(0, 0, 0, 0.08)'
          path(graticule())
          context.stroke()

          if (this.color) {
            countries.forEach((country) => {
              context.beginPath()
              const curColor = d3.color(color(country.id))
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
            context.fillStyle = this.color ? 'black' : 'red'
            path({
              type: 'Feature',
              geometry: { type: 'Point', coordinates: pos },
            })
            context.fill()
          })
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

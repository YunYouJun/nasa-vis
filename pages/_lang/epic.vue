<template>
  <v-card class="pa-2">
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
      width: 0,
      height: 0,
      address: [
        [116.3, 39.9],
        [16.3, 39.9],
        [86.3, 69.9],
        [116.3, 79.9],
        [6.3, 39.9],
        [163, 60.9],
        [136.3, -12.9],
        [-136.3, 10.9],
        [-136.3, -20.9],
      ],
      beijing: [116.3, 39.9],
    }
  },
  mounted() {
    this.height = this.getHeight()
    this.width = this.height
    this.drawChart()
  },
  methods: {
    // refer d3-inertia demo
    // https://github.com/Fil/d3-inertia
    drawCircle(ctx, pos) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(pos[0], pos[1], 6, 0, 2 * Math.PI)
      ctx.fillStyle = '#f00'
      ctx.fill()
      ctx.restore()
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

      let render = function () {}
      geoInertiaDrag(
        canvas,
        function () {
          render()
        },
        projection
      )

      d3.json(
        'https://cdn.jsdelivr.net/npm/world-atlas@latest/world/110m.json'
      ).then((world) => {
        const land = topojson.feature(world, world.objects.land)

        render = () => {
          context.clearRect(0, 0, width, height)

          context.beginPath()
          path(land)
          context.fill()

          context.strokeStyle = 'black'
          context.beginPath()
          path({ type: 'Sphere' })
          context.lineWidth = 2.5
          context.stroke()

          const p = projection.rotate().map((d) => Math.floor(10 * d) / 10)
          context.fillText(`λ = ${p[0]}, φ = ${p[1]}, γ = ${p[2]}`, 10, 10)

          this.address.forEach((pos) => {
            if (
              pos[0] < -p[0] + 90 &&
              pos[0] > -p[0] - 90 &&
              pos[1] + p[1] < 90 &&
              pos[1] + p[1] > -90
            )
              this.drawCircle(context, projection(pos))
          })
        }

        render()
      })
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

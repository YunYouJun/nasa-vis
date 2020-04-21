<template>
  <v-card :loading="loading">
    <v-card-title class="title">
      {{ $t('asteroids.pie-of-neos-with-phas') }}
    </v-card-title>
    <v-card-text>
      <div id="pie-chart-container"></div>
    </v-card-text>
  </v-card>
</template>

<script>
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
  watch: {
    neos(val, oldVal) {
      if (val.length === 0 && oldVal.length === 0) return
      d3.select('#pie-chart').remove()
      this.pieChart = this.drawPieChart(this.neos)
      // if (oldVal.length === 0 && !document.getElementById('pie-chart')) {
      //   this.pieChart = this.drawPieChart(this.neos)
      // } else {
      //   this.pieChart.update(this.neos)
      // }
    },
  },
  methods: {
    drawPieChart(data) {
      const width = 500
      const height = 600
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
        .attr('id', 'pie-chart')
        .attr('viewBox', [-width / 2, -height / 2, width, height])
        .attr('height', 500)

      let neoPie = svg
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

      return Object.assign(svg.node(), {
        update(data) {
          const t = svg.transition().duration(750)

          neoPie = neoPie
            .data(data, (d) => d.date)
            .join(
              (enter) =>
                enter
                  .append('g')
                  .attr('stroke', 'white')
                  .selectAll('path')
                  .data(arcs)
                  .join('path')
                  .attr('fill', (d) => color(d.data.date))
                  .attr('d', arc)
                  .append('title')
                  .text(
                    (d) => `${d.data.date}: ${d.data.PHAs.toLocaleString()}`
                  ),
              (update) => update.attr('fill', (d) => color(d.count)),
              (exit) =>
                exit.call((neoPie) =>
                  neoPie.transition().duration(600).remove().style('opacity', 0)
                )
            )
            .call((neoPie) =>
              neoPie
                .transition(t)
                .attr('fill', (d) => color(d.data.date))
                .attr('d', arc)
            )
        },
      })
    },
  },
}
</script>

<style></style>

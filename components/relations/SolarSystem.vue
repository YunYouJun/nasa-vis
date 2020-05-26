<template>
  <div>
    <div id="solar-system-container"></div>
    <h6 class="pa-2">Click for more info.</h6>
  </div>
</template>

<script>
import * as d3 from 'd3'
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/
export default {
  async mounted() {
    const data = await d3.json('/data/solar-system.json')

    const width = 800
    const height = 650

    const links = data.links.map((d) => Object.create(d))
    const nodes = data.nodes.map((d) => Object.create(d))

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const drag = (simulation) => {
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    }

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance((d) => {
            return d.distance / 20 + 100
          })
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))

    const svg = d3
      .select('#solar-system-container')
      .append('svg')
      .attr('viewBox', [0, 0, width, height])

    const link = svg
      .append('g')
      .attr('stroke', '#333')
      .attr('stroke-opacity', 0.1)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => d.orbit_velocity / 3)

    const node = svg
      .append('g')
      .attr('fill', 'currentColor')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .selectAll('g')
      .data(nodes)
      .join('a')
      .attr('href', (d) => {
        return `https://nssdc.gsfc.nasa.gov/planetary/factsheet/${d.id.toLowerCase()}fact.html`
      })
      .attr('target', '_blank')
      .attr('class', 'fact-link')
      .append('circle')
      .attr('opacity', 0.9)
      .attr('r', (d) => {
        return d.diameter / 10000 + 15
      })
      .attr('fill', (d) => color(d.diameter))
      .call(drag(simulation))

    node.append('title').text((d) => d.id)

    const text = svg
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => d.diameter / 40000)
      .attr('font-size', (d) => d.diameter / 20000 + 8)
      .text((d) => d.name)

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
      text.attr('x', (d) => d.x).attr('y', (d) => d.y)
    })

    // invalidation.then(() => simulation.stop())
  },
}
</script>

<style></style>

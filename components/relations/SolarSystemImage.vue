<template>
  <div>
    <div id="solar-system-image-container"></div>
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
      .select('#solar-system-image-container')
      .append('svg')
      .attr('viewBox', [0, 0, width, height])

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'triangle')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 1)
      .attr('refY', 5)
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', 2)
      .attr('markerHeight', 2)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', 'black')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')

    const link = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('stroke', (d) => color(d.distance))
      .attr('stroke-width', (d) => d.orbit_velocity / 3)
      .attr('marker-end', 'url(#triangle)')

    const imgHeight = 50
    const imgWidth = 50
    const imgRadius = 23

    const node = svg
      .append('g')
      .attr('fill', 'currentColor')
      .attr('stroke', 'black')
      .attr('stroke-width', 8)
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
      .attr('fill', (d, i) => {
        // for image
        const radius = d.diameter / 10000 + 15
        const defs = svg.append('defs').attr('id', 'imgdefs')
        const pattern = defs
          .append('pattern')
          .attr('id', 'pattern-' + i)
          .attr('height', 1)
          .attr('width', 1)
        pattern
          .append('image')
          .attr('x', -(imgWidth / 2 - imgRadius))
          .attr('y', -(imgHeight / 2 - imgRadius))
          .attr('width', radius * 2)
          .attr('height', radius * 2)
          .attr('xlink:href', `/images/${d.id.toLowerCase()}.jpg`)
        return 'url(#pattern-' + i + ')'
      })
      .attr('opacity', 0.9)
      .attr('r', (d) => {
        return d.diameter / 10000 + 15
      })
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

    function linkArc(d) {
      const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y)
      return `
          M${d.source.x},${d.source.y}
          A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
        `
    }

    simulation.on('tick', () => {
      link.attr('d', linkArc)
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

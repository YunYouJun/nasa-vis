<template>
  <div>
    <v-card>
      <div id="force-container"></div>
    </v-card>
  </div>
</template>

<script>
import * as d3 from 'd3'
import data from '~/assets/data/graph.json'
export default {
  mounted() {
    const width = 800
    const height = 650

    const links = data.links.map((d) => Object.create(d))
    const nodes = data.nodes.map((d) => Object.create(d))

    const color = () => {
      const scale = d3.scaleOrdinal(d3.schemeCategory10)
      return (d) => scale(d.group)
    }

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
        d3.forceLink(links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody())
      .force('x', d3.forceX())
      .force('y', d3.forceY())

    const svg = d3
      .select('#force-container')
      .append('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height])

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value))

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', color)
      .call(drag(simulation))

    node.append('title').text((d) => d.id)

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)
    })

    // invalidation.then(() => simulation.stop())
  },
}
</script>

<style></style>

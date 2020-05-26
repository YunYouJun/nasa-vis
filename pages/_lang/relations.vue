<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-card><disjoint-graph></disjoint-graph></v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card><relation-graph></relation-graph></v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card><solar-system></solar-system></v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DisjointGraph from '~/components/relations/DisjointGraph'
import RelationGraph from '~/components/relations/RealtionGraph'
import SolarSystem from '~/components/relations/SolarSystem'
export default {
  components: {
    DisjointGraph,
    RelationGraph,
    SolarSystem,
  },
}
</script>

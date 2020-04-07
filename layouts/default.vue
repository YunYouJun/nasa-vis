<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-icon>{{ svgPath.mdiMenu }}</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase" v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>{{ svgPath.mdiInvertColors }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2020 {{ author }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import {
  mdiMenu,
  mdiApps,
  mdiChartBubble,
  mdiLightbulbOutline,
  mdiCircleOutline,
  mdiStarOutline,
  mdiInvertColors,
  mdiEarth,
} from '@mdi/js'
import pkg from '~/package.json'
export default {
  data() {
    return {
      svgPath: {
        mdiMenu,
        mdiApps,
        mdiChartBubble,
        mdiLightbulbOutline,
        mdiCircleOutline,
        mdiStarOutline,
        mdiInvertColors,
      },
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: mdiApps,
          title: 'Welcome',
          to: '/',
        },
        {
          icon: mdiEarth,
          title: 'Asteroids',
          to: '/asteroids',
        },
        {
          icon: mdiChartBubble,
          title: 'About',
          to: '/about',
        },
      ],
      right: true,
      rightDrawer: false,
      title: pkg.name,
      author: pkg.author,
    }
  },
}
</script>

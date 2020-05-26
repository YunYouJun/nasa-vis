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
      <v-btn
        icon
        :to="
          $i18n.locale === 'en'
            ? '/zh' + $route.fullPath
            : $route.fullPath.replace(/^\/[^\/]+/, '')
        "
        exact
        nuxt
      >
        <v-icon>{{ svgPath.mdiTranslate }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon>{{ svgPath.mdiInvertColors }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container fluid="">
        <nuxt />
      </v-container>
    </v-content>
    <v-footer>
      <span>&copy; 2020 {{ author }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import {
  mdiMenu,
  mdiApps,
  mdiChartBubble,
  mdiInvertColors,
  mdiEarth,
  mdiTranslate,
  mdiStarOutline,
  mdiRelationManyToMany,
} from '@mdi/js'
import pkg from '~/package.json'
export default {
  data() {
    return {
      svgPath: {
        mdiMenu,
        mdiInvertColors,
        mdiTranslate,
      },
      clipped: false,
      drawer: false,
      right: true,
      rightDrawer: false,
    }
  },
  computed: {
    title() {
      return this.$t(pkg.name)
    },
    author() {
      return this.$t(pkg.author)
    },
    items() {
      return [
        {
          icon: mdiApps,
          title: this.$t('links.home'),
          to: '/',
        },
        {
          icon: mdiStarOutline,
          title: this.$t('links.asteroids'),
          to: '/asteroids',
        },
        {
          icon: mdiEarth,
          title: this.$t('links.epic'),
          to: '/epic',
        },
        {
          icon: mdiRelationManyToMany,
          title: this.$t('links.relations'),
          to: '/relations',
        },
        {
          icon: mdiChartBubble,
          title: this.$t('links.about'),
          to: '/about',
        },
      ]
    },
  },
}
</script>

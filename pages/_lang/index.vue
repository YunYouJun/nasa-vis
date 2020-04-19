<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <orbit-logo />
      </div>
      <v-card class="mt-5">
        <v-card-title class="headline justify-center" style="min-width: 365px;">
          {{ $t('home.headline') }}
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item href="https://api.nasa.gov/" target="_blank">
              <v-list-item-icon>
                <v-icon>{{ svgPath.mdiApi }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ $t('home.api') }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              href="https://github.com/YunYouJun/nasa-viz"
              target="_blank"
            >
              <v-list-item-icon>
                <v-icon>{{ svgPath.mdiGithub }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>NASA-VIZ GitHub</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              href="https://github.com/YunYouJun/nasa-viz/issues"
              target="_blank"
            >
              <v-list-item-icon>
                <v-icon>{{ svgPath.mdiBug }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  $t('home.bug-report')
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn class="mb-5" nuxt to="/asteroids">
            {{ $t('home.continue') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mdiApi, mdiGithub, mdiBug } from '@mdi/js'
import OrbitLogo from '~/components/OrbitLogo.vue'
export default {
  components: {
    OrbitLogo,
  },
  data() {
    return {
      svgPath: {
        mdiApi,
        mdiGithub,
        mdiBug,
      },
    }
  },
  head() {
    return { title: this.$t('home.title') }
  },
}
</script>

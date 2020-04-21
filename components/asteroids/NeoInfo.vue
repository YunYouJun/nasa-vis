<template>
  <v-card>
    <v-card-title class="title py-1">
      {{ $t('asteroids.neo') }}
    </v-card-title>

    <v-card-actions class="py-0">
      <v-card-subtitle class="headline">
        {{ elementCount }}
      </v-card-subtitle>

      <v-spacer></v-spacer>

      <v-btn icon @click="show = !show">
        <v-icon>{{
                  (show ? svgPaths.mdiChevronUp : svgPaths.mdiChevronDown)
        }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>
          <v-row
            ><v-col cols="12" sm="6">
              <v-img
                src="https://i.loli.net/2020/04/08/djXSl754vCUTzIK.png"
              ></v-img>
            </v-col>
            <v-col cols="12" sm="6">
              数据来源：NASA（National Aeronautics and Space
              Administration），美国国家航空航天局。
              <hr class="my-2" />
              Data-set: All the data is from
              <a href="http://neo.jpl.nasa.gov/" target="_blank"
                >the NASA JPL Asteroid team</a
              >
              .
              <hr class="my-1" style="opacity: 0.3;" />
              NeoWs (Near Earth Object Web Service) is a RESTful web service for
              near earth Asteroid information. With NeoWs a user can: search for
              Asteroids based on their closest approach date to Earth, lookup a
              specific Asteroid with its NASA JPL small body id, as well as
              browse the overall data-set.
              <hr class="my-2" />
              近地天体 （near-Earth object,
              NEO）为太阳系内其轨道接近地球的天体。所有近地天体的轨道近日点都小于1.3天文单位，它们包括数以千计的近地小行星、接近的彗星、和大到在撞击到地球之前还在太空时就能够被监测的流星体。
              <hr class="my-2" />
              潜在危险天体（potentially hazardous
              object，PHO）是指轨道有撞击地球的可能，且其大小足以对地球造成全球或局部区域重大损害的近地天体
              －无论是小行星或彗星。 多数这类天体是潜在危险小行星（potentially
              hazardous
              asteroids，PHAs），其定义为与地球的最小轨道交点距离少于0.05天文单位（19.5月距），并且绝对星等亮达22等或更亮。
              <hr class="my-2" />
              2009 年印度尼西亚事件中，直径约 10 米的小行星便释放出约 2
              倍于广岛原子弹。
              著名的白垩纪-第三纪灭绝事件与通古斯大爆炸均推测为天体引发的撞击事件。
            </v-col>
            <v-col cols="12"
              >数据结论：只有一小部分近地行星的运动轨迹可能对地球产生威胁，最终实际威胁到地球的情况微乎其微。地球末日很难到来，我们仍旧应当珍惜现有的生活。我们一日日度过的所谓日常，实际上可能是接连不断的奇迹。</v-col
            >
          </v-row>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
export default {
  props: {
    elementCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      svgPaths: {
        mdiChevronUp,
        mdiChevronDown,
      },
      show: false,
    }
  },
}
</script>

<style></style>

<template>
  <v-layout>
    <v-flex class="text-center">
      <blockquote class="blockquote">
        <div class="display-3">{{ say }}</div>
      </blockquote>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      say: 'Our journey is the sea of ​stars.',
    }
  },
}
</script>

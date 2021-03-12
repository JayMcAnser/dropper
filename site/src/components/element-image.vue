<template>
  <v-card
      @click="elementClick"
  >
    image
    <image-scroll
      :element="element">

    </image-scroll>
  </v-card>
</template>

<script>


import ImageScroll from "@/components/image-scroll";
import {debug} from "@/vendors/lib/logging";
export default {
  name: "element-image",
  components: {ImageScroll},
  data: function() {
    return {
    }
  },
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  methods: {
    elementClick() {
      debug('', 'element-image.click')
      this.$emit('activate', this)
    }
  },
}
</script>

<style scoped>

</style>

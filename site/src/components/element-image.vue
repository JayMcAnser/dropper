<template>
  <v-card>
    <image-scroll
      :element="element">

    </image-scroll>
  </v-card>
</template>

<script>


import ImageScroll from "@/components/image-scroll";
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
}
</script>

<style scoped>

</style>

<template>
  <img v-bind:src="imageUrl">
</template>

<script>

export default {
    name: "image-scroll",
    props: {
      element: {
        type: Object,
        require: true
      }
    },
    computed: {
      imageUrl() {
        return this.element.imageUrl
      }
    }
  }

</script>

<style scoped>

</style>

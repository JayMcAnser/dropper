<template>
  <v-card>
    <v-card-text>Unknown element type: {{type}}</v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "view-unknown",
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  computed: {
    type() {
      if (this.element) {
        return element.type
      }
      return 'missing element'
    }
  }
}
</script>

<style scoped>

</style>

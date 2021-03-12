<template>
  <v-card>
    <v-card-title>{{element.title}}</v-card-title>
    <v-card-text class="multi-line" v-text="element.description"></v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "view-text",
  data: function() {
    return {
    }
  },
  props: {
    element: {
      type: Object,
      require: true
    }
  }
}
</script>

<style scoped>
  .multi-line {
    white-space: pre;
  }
</style>

<template>
  <v-card>
    IMAGE
    <v-card-title>{{element.title}}</v-card-title>
    <v-card-text class="multi-line" v-text="element.description"></v-card-text>
    <image-view
        :element="element"
    ></image-view>
  </v-card>
</template>

<script>


  import ImageView from "@/components/image-view";
  export default {
    name: "view-image",
    components: {ImageView},
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

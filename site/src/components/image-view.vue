<template>
  <div>
    <img v-auth-image="imageUrl" />>
  </div>
</template>

<script>
  import axios from 'axios';
  import Vue from 'vue';
  import VueAuthImage from 'vue-auth-image';

  Vue.use(VueAuthImage);
  export default {
    name: "image-view",
    props: {
      element: {
        type: Object,
        required: true
      }
    },
    computed: {
      imageUrl() {
        return this.element.url
      }
    }
  }
</script>

<style scoped>
  img {
    width: 100%;
  }
</style>

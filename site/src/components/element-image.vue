<template>
  <v-card 
    elevation="0">  
    <div ref="container">       
      <v-zoomer>
        <img
          style="object-fit: contain; width: 100%; height: 100%;"          
          :src="imageURL"
        />        
      </v-zoomer>    
    </div>
    <v-card-title v-show="element.title " >{{element.title}}</v-card-title>
    <v-card-text v-show="element.description">{{element.description}}</v-card-text>
    <v-card-actions>
      <v-btn
        @click="showInfo()"
      >
        info
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import iconAction from '../assets/icon-action.jpg'
export default {
  

  name: "element-image",
  data: function() {
    return {       
    //  imageURL: false
    }
  },
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageURL() {
      let url = this.$store.getters['board/publicImageRoot'] + this.element.image      
      return url
    },
    height() {
      if (this.element.height) {
        return this.element.height
      } else {
        return 200
      }
    }
  },
  methods: {
  },
  mounted() {

  //  this.imageURL =  this.$store.getters['board/publicImageRoot'] + this.element.image;
  }
}
</script>

<style scoped>
 
</style>

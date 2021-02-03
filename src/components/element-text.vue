<template>
  <v-card 
    elevation="0">    
    <v-card-title v-if="element.title" >{{element.title}}</v-card-title>
    <v-card-text v-if="element.description">{{element.description}}</v-card-text>
  </v-card>
</template>

<script>

import { pickBy} from 'lodash';

// hide properties from the info bar
const HIDDEN_PROPERTIES = 
  ['type'];

export default {
  name: "element-unknown",
  data: function() {
    return {       
      showProperties: false
    }
  },
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  computed: {
    elementType() {
      return this.element.type ? this.element.type : ' - type is missing -'
    },
    properties() {
      let list = _.pickBy(this.element, (value, key) => { return !!HIDDEN_PROPERTIES[key]}) 
      console.log('element.props', list)
      return list
    }
  },
  methods: {
    
  },
}
</script>

<style scoped>
 
</style>

<template>
  <v-card 
    elevation="0">    
    <v-card-title>
      id: {{id}}
      {{element.title}}
      <v-spacer></v-spacer>
      <btn-edit-element
        :element="element"
        >
      </btn-edit-element>
      <v-btn
        @click="add"
      >add</v-btn>      
    </v-card-title>
    <v-card-text>OOO{{title}}</v-card-text>
    <v-card-text v-if="element.description">{{element.description}}</v-card-text>
  </v-card>
</template>

<script>

import { pickBy} from 'lodash';
import btnEditElement from './btn-edit-element.vue';
import {debug} from '../vendors/lib/logging';

// hide properties from the info bar
const HIDDEN_PROPERTIES = 
  ['type'];

export default {
  name: "element-text",
  data: function() {
    return {       
      showProperties: false,
      element: {},
    }
  },
  components: { btnEditElement },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    title() {
      let elm = this.$store.getters['board/xxx']
      if (elm) {
        return elm[this.id].title
      }
      return 'xx'
    }
  },
  watch: {
    id: function(val) {      
      this.element = this.$store.getters['board/element'](this.id)
      debug(this.element, 'element-text')
    }
  },
  mounted () {
    this.element = this.$store.getters['board/element'](this.id)
    debug(this.element, 'element-text.mounted')
  },
  methods: {
    async add() {
      let rec = Object.assign({}, this.element)
      rec.title += 'a'
      // this.element = rec;
      // this does NOT work
      // this.$store.dispatch('element/save', rec)
      // but this does:
      // this.$store.getters['board/element'](rec.id).title = rec.title
      await this.$store.dispatch('element/save', rec)
    }
  },
}
</script>

<style scoped>
 
</style>

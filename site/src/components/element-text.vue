<template>
  <v-card
      @click="elementClick"
  >
    <v-card-title>
      {{element.title}}
      <!--
      <v-spacer></v-spacer>
      <btn-edit-element
        :element="element"
        >
      </btn-edit-element>
      -->
    </v-card-title>
    <v-card-text v-if="element.description">{{element.description}}</v-card-text>
  </v-card>
</template>

<script>


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
      text: 'start',
      backdoor: 0
    }
  },
  components: {
    btnEditElement
  },
  props: {
    element: {
      type: Object,
      required: true,
      default: {}
    }
  },
  computed: {

  },


  methods: {
    elementClick() {
      debug('', 'element-text.click')
      this.$emit('activate', this)
    }
  },
}
</script>

<style scoped>

</style>

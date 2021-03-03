<template>
  <v-card
    elevation="0">
    <v-card-title>
      {{element.title}}
      <v-spacer></v-spacer>
      <btn-edit-element
        :element="element"
        >
      </btn-edit-element>
    </v-card-title>
    <v-card-text v-if="element.description">{{element.description}}</v-card-text>
  </v-card>
</template>

<script>

import { pickBy} from 'lodash';
import btnEditElement from './btn-edit-element.vue';
import {debug} from '../vendors/lib/logging';
import Vue from 'vue'

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
  components: { btnEditElement },
  props: {
    element: {
      type: Object,
      required: true,
      default: {}
    }
  },
  computed: {
    title() {
      this.backdoor++
      if (!this.element) {
        return 'no value'
      }
      return this.element.title
    }
  },


  methods: {
    b() {
      this.text = 'bbb'
    },
    async add() {
      let rec = Object.assign({}, this.element)
      rec.title += 'a';
          // this.text += 'a'
          // // this.element = rec;
          // this.$set(this.element, 'title', this.text);
      // this does NOT work
      // this.$store.dispatch('element/save', rec)
      // but this does:
      // this.$store.getters['board/element'](rec.id).title = rec.title
      await this.$store.dispatch('element/save', rec)
      // debug(this.element, 'element-text')
      // debug(this.$store.getters['board/element'](this.element.id), 'direct')

    }
  },
}
</script>

<style scoped>

</style>

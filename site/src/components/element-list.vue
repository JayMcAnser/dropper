<template>
  <div>
    <v-btn @click="me">click me</v-btn>
    <component v-for="element in elements" :key="element.id"
      :is="componentType(element)"
      :element="storeElement(element.id)"
    >
    </component>
  </div>
</template>

<script>
import ElementUnknown from './element-unknown'
import ElementText from './element-text';
import ElementImage from './element-image';
import ElementCanvas from './element-canvas';
import {debug} from '../vendors/lib/logging';

const COMPONENT_TYPE = {
  unknown: ElementUnknown,
  text: ElementText,
  image: ElementImage,
  canvas: ElementCanvas
}
export default {
  name: "element-list",
  data: function() {
    return {
    }
  },
  props: {
    elements: {
      type: Array,
      require: true
    }
  },
  // watch: {
  //   elements: async function() {
  //     this.elementsData = await this.$store.dispatch('board/elements', this.elements)
  //   }
  // },
  computed: {

  },
  methods: {
    me() {
      let elm = this.$store.getters['board/element'](this.elements[2].id);
      elm.title += 'x'
      debug(elm, 'click me')
    },
    storeElement(id) {
      let elm = this.$store.getters['board/element'](id);
      debug(elm, 'element-list')
      return elm;
    },
    componentType(element) {
      let elm = this.$store.getters['board/element'](element.id);
      debug(elm, 'element.list')
      if (!elm.type) {
        return COMPONENT_TYPE.unknown
      } else {
        return COMPONENT_TYPE[elm.type]
      }
    }
  },
}
</script>

<style scoped>
  .title {
    font-weight: bold;
  }
</style>

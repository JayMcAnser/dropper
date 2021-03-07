<template>
  <div>
    <component v-for="element in elements" :key="element.id"
      :is="componentType(element)"
      :element="element"
      @activate="elementClicked(element)"
    >
    </component>
  </div>
</template>

<script>
import ElementUnknown from './element-unknown'
import ElementText from './element-text';
import ElementImage from './element-image';
import ElementCanvas from './element-canvas';
import {debug} from '@/vendors/lib/logging';

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

  methods: {
    componentType(element) {
      if (!COMPONENT_TYPE[element.type]) {
        //debug(`unknown element ${element.type}`, 'element-list')
        return COMPONENT_TYPE.unknown
      } else {
        return COMPONENT_TYPE[element.type]
      }
    },
    elementClicked(element) {
      this.$emit('activate', element)
    }

  },
}
</script>

<style scoped>
  .title {
    font-weight: bold;
  }
</style>

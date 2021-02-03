<template>
  <div>
    <component v-for="element in elements" :key="element.id"
      :is="componentType(element)"
      :element="element"
    >
    </component>
  </div>
</template>

<script>
import ElementUnknown from './element-unknown'
import ElementText from './element-text';
import ElementImage from './element-image';
import ElementCanvas from './element-canvas';

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
  computed: {
   
  },
  methods: {
     componentType(element) {
      if (!COMPONENT_TYPE.hasOwnProperty(element.type)) {
        return COMPONENT_TYPE.unknown
      } else {
        return COMPONENT_TYPE[element.type]
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

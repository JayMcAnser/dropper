<template>
  <div>
    <h2>Column View {{ column.id }} {{ elements.length}} elements</h2>
    <element-list
      :elements="elements"></element-list>
  </div>
</template>

<script>
import elementList from './element-list.vue'
/**
 * list the board available
 */
export default {
  components: { elementList },
  name: "column-view",
  data: function() {
    return {       
    }
  },
  props: {
    column: {
      type: Object,
      required: true
    }
  },
  computed: {
    elements() { 
      return this.column.elements ? this.column.elements : []
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .title {
    font-weight: bold;
  }
</style>

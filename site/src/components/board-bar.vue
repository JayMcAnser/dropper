<template>  
  <v-app-bar 
    dense   
    fixed    
  >
    <spark-line
      :columns="columns"
    ></spark-line>    
  </v-app-bar>
</template>

<script>
  import SparkLine from './spark-line.vue'
 
  export default {
    name: 'BoardBar',    
    props: {
      columns: {
        type: Array,
        required: true
      }
    },
    components: {
      SparkLine
    }  
  }
</script>

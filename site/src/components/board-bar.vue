<template>  
  <v-app-bar 
    dense   
    fixed    
  >
    <spark-line
      :columns="columns"
    ></spark-line> 
    <div
      v-if="isAuthenticated"
    >
     <v-btn       
        icon
        @click="options()"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </div>   
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
     computed: {
      isAuthenticated() {
        return this.$store.getters['auth/isLoggedIn']
      }
    },   
    components: {
      SparkLine
    }  
  }
</script>

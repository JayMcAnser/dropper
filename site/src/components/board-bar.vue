<template>  
  <v-app-bar 
    dense   
    fixed    
  >
    <spark-line
      :columns="columns"
    ></spark-line> 
    <v-spacer></v-spacer>
    <div
      v-if="isAuthenticated"
    >
     <v-btn       
        icon
        @click="showMore()"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </div>      
  </v-app-bar>
</template>

<script>
  import SparkLine from './spark-line.vue'
  import {debug} from '../vendors/lib/logging'

  export default {
    name: 'BoardBar',    
    props: {
      columns: {
        type: Array,
        required: false
      }
    },
     computed: {
      isAuthenticated() {
        return this.$store.getters['auth/isLoggedIn']
      }
    },  
    methods: {
      showMore() {        
        return this.$store.dispatch('status/toggleRightDrawer')
      }
    }, 
    components: {
      SparkLine
    }  
  }
</script>

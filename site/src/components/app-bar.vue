<template>
  <div>
    <v-toolbar 
      dense
      dark      
    >
      <slot name="left"></slot>
      <v-spacer></v-spacer>      
      <slot name="right"></slot>
      <v-btn 
        v-if="!isAuthenticated"
        @click='login()'
        icon >
        <v-icon>mdi-account</v-icon>
      </v-btn>  
      <v-btn
        v-if="isAuthenticated"
        icon
        @click="options()"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
    
  </div>
</template>

<script>
  import {debug} from '../vendors/lib/logging';
  export default {
    name: 'AppBar', 
    computed: {
      isAuthenticated() {
        return this.$store.getters['auth/isLoggedIn']
      }
    },   
    methods: {
      login: function() {
        this.$router.push('/login')
      },
      options: function() {
        debug('opening right drawer')
        this.$store.dispatch('status/rightDrawer', true);  
      },
      doCancel() {
        debug('wrong doCancel')
      }

    }
  }
</script>

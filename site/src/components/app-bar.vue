<template>
  <div>
    <v-toolbar 
      dense
      dark      
    >
      <v-spacer></v-spacer>
      <v-btn 
        @click='account()'
        icon >
        <v-icon>mdi-account</v-icon>
      </v-btn>       
    </v-toolbar>
    
  </div>
</template>

<script>
  export default {
    name: 'AppBar',    
    methods: {
      account: function() {
        this.$router.push('/login')
      }
    }
  }
</script>

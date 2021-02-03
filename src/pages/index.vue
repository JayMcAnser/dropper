<template>
  <v-app id="app">    
    <router-view
      :key="$route.fullPath"
    >  
    </router-view>     
  </v-app>
</template>

<script>
/**
 * this page is loaded by ALL pages * 
 */
export default {
  data: function() {
    return {      
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;  
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

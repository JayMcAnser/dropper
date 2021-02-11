<template>
  <v-app id="app">    
    <router-view
      :key="$route.fullPath"
    >  
    </router-view>     
    <v-navigation-drawer
      v-model="rightDrawer"
      absolute
      right
      temporary
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>         
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title> {{ user.username}}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>     

        <v-list-group
          prepend-icon="mdi-home-city"
        >
          <template v-slot:activator>           
            <v-list-item-content>
              <v-list-item-title v-text="'New'"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="newAction in newActions" 
            :key="newAction.id"
            @click="menuURL(newAction.actionURL)"
          >
            <v-list-item-title>
              {{ newAction.title}}
            </v-list-item-title>
            <v-list-item-icon>
              <v-icon>{{newAction.icon}}</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>

 <v-divider></v-divider>     

        <v-list-item
          @click="logout"
        >
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            Logout
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>    
  </v-app>
</template>

<script>
import {debug} from '../vendors/lib/logging'
/**
 * this page is loaded by ALL pages * 
 */
const NEW_ITEMS = [
  { key: 1, title: 'Board', icon: 'mdi-vector-combine' , actionURL: '/boardNew'},
  { key: 2, title: 'Column', icon: 'mdi-table-column-plus-after'},
  { key: 3, title: 'Element', icon: 'mdi-power-socket-jp'}
]

export default {
  data: function() {
    return {  
      newActions: NEW_ITEMS  
    }
  },
  computed: {
    leftDrawer: {
      get: function () {
        return this.$store.getters['status/leftDrawer']
      },
      set: function(val) {
        this.$store.dispatch('status/leftDrawer', val)  
      }
      
    },
    rightDrawer: {
      get: function() {
        return this.$store.getters['status/rightDrawer'];
      }, 
      set: function(show) {
        return this.$store.dispatch('status/rightDrawer', show)
      }
    },
    user() {      
      return this.$store.getters['auth/user']
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout');
      this.rightDrawer = false;      
      this.$router.go()
    },
    menuURL(url) {
      debug(`open ${url}`, 'pages.index');      this.$router.push(url)
    }  
  }, 
  async mounted() {
    debug('check restore')
    this.$store.dispatch('auth/restore');
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

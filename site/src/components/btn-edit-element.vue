<template>
  <div v-if="isAuth">
    <v-btn 
      class="text-right" 
      icon
      @click="editElement">
      <v-icon>mdi-pencil
      </v-icon>  
    </v-btn>
  </div>
</template>
<script>
  export default {
    name: 'btn-edit-element',
    props: {
      element: {
        type: Object,
        required: true
      }
    },
    computed: {
      isAuth() {
        return this.$store.getters['auth/isLoggedIn']
      }
    },
    methods: {
  
      async editElement() {
        await this.$store.dispatch('status/dialog', {name: 'elementDialog', id: this.element.id});
      }            
    }
  }
  
</script>
<template>
  <div class="error">
    <h1>The was an error</h1>
    <p>
      {{ $route.params.message }}
    </p>
    <p>
      <v-btn
        @click="operUrl()"
      >
        Refresh
      </v-btn>
    </p>
  </div>
</template>

<script>
/** 
 * the global error page
 */
  export default {
    data: function() {
      return {

      }
    },
    methods: {
      openUrl() {

        this.$route.push(this.$route.url)
      }
    },
    mounted() {
      this.message = $  
    }
  }
</script>
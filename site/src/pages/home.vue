<template>
  <div>
    <h2>Dropper Curator</h2>   
    <webview></webview>
  </div>
</template>

<script>
// @ is an alias to /src
import Webview from '../components/webview.vue'
 
export default {
  name: 'Home',
  components: {   
    Webview
  }
}
</script>

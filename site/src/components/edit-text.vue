<template>
  <v-card  class="elevation-0">
    <v-card-text>
      <v-form
          v-model="valid">
        <v-jsf v-model="model" :schema="schema"/>
      </v-form>
      <pre></pre>
    </v-card-text>
  </v-card>
</template>

<script>
import {debug, warn, error} from "@/vendors/lib/logging";
import VJsf from '@koumoul/vjsf/lib/VJsf.js'
import '@koumoul/vjsf/lib/VJsf.css';

export default {
  name: "edit-text",
  data: function() {
    return {
      valid: true
    }
  },
  components: {
    VJsf
  },
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  computed: {
    schema() {
      if (this.element) {
        return this.element.editSchema()
      }
      debug('missing schema', 'edit-text.schema')
      return {}
    },
    model: {
      get: function () {
        // debug('get model', 'dialog-element.get')
        return this.element.model
      },
      set: function (model) {
        // does not need it. It directly modifies the element
        // but it returns an error if no setter is available
      }
    }
  }
}
</script>
<style >
  .no-padding .v-input__slot {
    padding: 0 !important;
    background-color: white !important;
  }

</style>

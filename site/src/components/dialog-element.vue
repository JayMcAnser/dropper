<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-card-title>{{ element.type }}</v-card-title>
        <v-card-text>
          <v-form
              v-model="valid">
              <v-jsf v-model="model" :schema="schema"/>
          </v-form>
          <pre></pre>
        </v-card-text>
      </v-card>


      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            @click="doSubmit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-dialog>
  </v-row>
</template>

<script>
import {debug, warn, error} from "@/vendors/lib/logging";
import VJsf from '@koumoul/vjsf/lib/VJsf.js'
import '@koumoul/vjsf/lib/VJsf.css'

export default {
  name: "dialog-element",
  data: function() {
    return {
      valid: false,
      element: {},
      board: {},
      fields: [],
    }
  },
  components: {
    VJsf
  },
  computed: {
    dialog: {
      get: function () {
        return this.$store.getters['status/dialogName'] === 'elementDialog'
      },
      set: function (value) {
        this.$store.dispatch('status/dialog', false)
      }
    },
    schema() {
      return this.element.schema
    },
    model:  {
      get: function() {
        debug('get model', 'dialog-element.get')
        return this.element.model
      },
      set: function(model) {
        debug(model, 'dialog-element.set')
       // this.element.model = model
      }
    }
  },
  watch: {
    dialog(visible) {
      if (visible) {
        debug(`dialog state changed ${visible}`, 'element-dialog');
        let elementId = this.$store.getters['status/dialogId'];
        if (elementId) {
          this.board = this.$store.getters['board/active'];
          if (this.board) {
            this.element = this.board.element(elementId);
          //  this.loadElement();
          } else {
            warn(`missing active board`)
          }
        } else {
          warn(`missing status/dialogId`)
        }
        return {}
      }
    }
  },
  methods: {
    async doSubmit() {
      debug('submit', 'element-dialog')
      // for (let index = 0; index < this.fields.length; index++) {
      //   this.element[this.fields[index]] = this.model[this.fields[index]]
      // }
      try {
        await this.board.save();
        this.$store.dispatch('status/dialog' )
      } catch (e) {
        error(e.message, 'element-dialog')
      }
    },
    loadElement() {
      // this.model = {};
      // this.fields = [];
      // for (let fieldname in this.schema.properties) {
      //   if (!this.schema.properties.hasOwnProperty(fieldname)) { continue};
      // //  this.model[fieldname] = this.element[fieldname]
      //   this.fields.push(fieldname);
      // }
    }
  }
}
</script>

<style scoped>

</style>

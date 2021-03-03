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
            text
            @click="doCancel"
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
import '@koumoul/vjsf/lib/VJsf.css';
import {cloneDeep} from 'lodash';

export default {
  name: "dialog-element",
  data: function() {
    return {
      valid: false,
      element: {},
      board: {},
      fields: [],
      modelBackup: {}
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
        // debug('get model', 'dialog-element.get')
        return this.element.model
      },
      set: function(model) {
        // does not need it. It directly modifies the element
        // but it returns an error if no setter is available
      }
    }
  },
  watch: {
    dialog(visible) {
      if (visible) {
        let elementId = this.$store.getters['status/dialogId'];
        if (elementId) {
          this.board = this.$store.getters['board/active'];
          if (this.board) {
            this.element = this.board.element(elementId);
            this.modelBackup = cloneDeep(this.element.model)
          //  this.loadElement();
          } else {
            warn(`missing active board`, 'dialog-element')
          }
        } else {
          warn(`missing status/dialogId`, 'dialog-element')
        }
      }
    }
  },
  methods: {
    async doSubmit() {
      try {
        await this.board.save();
        this.$store.dispatch('status/dialog' );
        this.hideDialog();
      } catch (e) {
        error(e.message, 'element-dialog')
      }
    },
    async doCancel() {
      // debug(this.modelBackup, 'dialog-element.cancel')
      Object.assign(this.model, this.modelBackup);
      await this.board.elementCancel(this.element.id)
      this.hideDialog()
    },
    hideDialog() {
      this.$store.dispatch('status/dialog', false)
    }

  }
}
</script>

<style scoped>

</style>

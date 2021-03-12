<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
    >

      <v-card>
        <v-card-title>{{ board.title }}</v-card-title>
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
export const BOARD_EDIT = 'boardEdit';

export default {
  name: "dialog-board",
  data: function() {
    return {
      valid: false,
      modelBackup: {}
    }
  },
  props: {
    board: {
      type: Object,
      required: true
    }
  },
  components: {
    VJsf
  },
  computed: {
    dialog: {
      get: function () {
        return this.$store.getters['status/dialogName'] === BOARD_EDIT
      },
      set: function (value) {
        this.$store.dispatch('status/dialog', false)
      }
    },
    schema() {
      if (Object.keys(this.board).length) {
        //debug(this.board, 'dialog-board')
        return this.board.editSchema()
      }
      return {}
    },
    model:  {
      get: function() {
        return this.board.model
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
        if (this.board) {
          this.modelBackup = cloneDeep(this.board.model)
        } else {
          warn(`missing board`, 'dialog-board')
        }
      }
    }
  },
  methods: {
    async doSubmit() {
      try {
        await this.board.save();
        await this.$store.dispatch('status/dialog' );
        await this.$store.dispatch('board/activate', {id: this.board.id})
        this.hideDialog();
      } catch (e) {
        error(e.message, 'board-dialog')
      }
    },
    async doCancel() {
      debug(this.board, 'dialog-board.cancel')
      await this.board.cancel()
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

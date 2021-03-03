<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
    >
      <v-card>
        <v-list>
          <v-list-item
              v-for="(element, id) in elementTypes" :key="id"
              @click="createElement(id)"
          >
            {{element.caption}}
          </v-list-item>
        </v-list>
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
      </v-card-actions>
    </v-dialog>
  </v-row>
</template>

<script>
import {debug, warn} from "@/vendors/lib/logging";

export default {
  name: "dialog-element-new",
  data: function() {
    return {
      elementTypes: {
        text: {
          caption: 'Text'
        },
        image: {
          caption: 'Image'
        },
        layout: {
          caption: 'layout'
        },
        column: {
          caption: 'column'
        }
      }
    }
  },
  computed: {
    dialog: {
      get: function () {
        return this.$store.getters['status/dialogName'] === 'elementNew'
      },
      set: function (value) {
        this.$store.dispatch('status/dialog', false)
      }
    }
  },
  methods: {
    async createElement(id) {
      this.board = this.$store.getters['board/active'];
      let element = await this.board.elementCreate({type:id, key: `${id}.${this.board.elementCount}`});
      this.$store.dispatch('status/dialog', {name: 'elementDialog', id: element.id})
    }
  }
}
</script>

<style scoped>

</style>

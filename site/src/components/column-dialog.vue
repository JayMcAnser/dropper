<template>
  <v-row justify="center">  
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    > 
      <v-card>
        <v-card-title>
          <span class="headline">Element definition</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="name"
                  label="Name*"
                  hint="for refer"
                  required
                ></v-text-field>
              </v-col>
             
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="Title"
                  v-model="title"
                  hint="The title to display"
                  persistent-hint                  
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-autocomplete
                  v-model="type"
                  :items="['text', 'image', 'column', 'container']"
                  label="Type"
                  hint="Type of element"
                  persistent-hint
                  reqiored
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                md="4"
                sm="6"
              >
                <v-autocomplete
                  :items="['Room', 'Furniture', 'Floor', 'Lamp', 'Design', 'Drawing', 'Foto', 'Letter', 'History']"
                  label="Tags"
                  hint="Tags describing the element"
                  multiple
                  persistent-hint
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
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
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { debug } from '../vendors/lib/logging';

export default {
  name: "column-dialog",
  data: function() {
    return {   
      name: '',
      title: '',
      type: 'text',
      tags: []         
    }
  },
  computed: {
  
    dialog: {
      get: function() {
        return this.$store.getters['status/dialogName'] === 'columnDialog'
      }, 
      set: function(value) {
        this.$store.dispatch('status/dialog', false)
      }
    }
  } ,
  watch: {
    dialog: function(val) {
      if (val) {
        this.loadData(this.$store.getters['status/dialogId']);
      }
    }
  },
  methods: {  
    doSubmit() {
      this.dialog = false;
    },
    loadData(id) {
      if (id) {

      } else {

      }
    }

  }
}
</script>

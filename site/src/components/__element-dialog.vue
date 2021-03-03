<template>
  <v-row justify="center">  
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    > 
      <v-card>
        <v-card-title>
          <span class="headline">Element definition</span><br>          
        </v-card-title>
        <v-card-text>
          <small>id: {{element.id}}</small>
        </v-card-text>        
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="element.key"
                  label="Key*"
                  hint="for referer"
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
                  v-model="element.title"
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
                  v-model="element.type"
                  :items="['text', 'image', 'column', 'container']"
                  label="element.Type"
                  hint="Type of element"
                  persistent-hint
                  reqiored
                ></v-autocomplete>
              </v-col>
<!--              
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
-->              
            </v-row>
          </v-container>
          
        
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
import Factory from '../lib/factory';

export default {
  name: "element-dialog",
  data: function() {
    return {     
      element: {},      
    }
  },
  computed: {
  
    dialog: {
      get: function() {
        return this.$store.getters['status/dialogName'] === 'elementDialog'
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
    async doSubmit() {
      await this.$store.dispatch('element/save', this.element)
      this.dialog = false;
    },
    async loadData(id) {
      this.id = id;            
      await this.$store.dispatch('element/activate', {id: this.id})
      this.element = Factory(this.$store.getters['element/data']);    
      debug(`element: ${JSON.stringify(this.element)}`, 'dialog.element.load')    
      console.log(this.element)
    }

  }
}
</script>

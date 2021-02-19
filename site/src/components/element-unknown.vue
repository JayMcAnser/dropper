<template>
  <v-card>    
    <v-card-title
    >
      {{elementType}}
      <v-spacer></v-spacer>
      <btn-edit-element
        :element="element"
        >
      </btn-edit-element>
      <div>  
        <!--    
      <v-btn 
        class="text-right" 
        icon
        @click="editElement">
        <v-icon>mdi-pencil
        </v-icon>  
      </v-btn>
      -->
      </div>
    </v-card-title>
    <v-card-actions>
      <v-btn
        color="orange lighten-2"
        text
      >
        Explore
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="showProperties = !showProperties"
      >
        <v-icon>{{ showProperties ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="showProperties">        
        <v-card-text >
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    property
                  </th>
                  <th class="text-left">
                    value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(value, key) in element" :key="key"                
                >
                  <td>{{ key }}</td>
                  <td>{{ value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>

import { pickBy} from 'lodash';
import btnEditElement from './btn-edit-element.vue';

// hide properties from the info bar
const HIDDEN_PROPERTIES = 
  ['type'];

export default {
  components: { btnEditElement },
  name: "element-unknown",
  data: function() {
    return {       
      showProperties: false,
      element,
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  watch: {
    id: function(val) {
      this.element = this.$store.getters['board/element'](this.id)
    }
  },
  computed: {
    elementType() {
      return this.element.type ? this.element.type : ' - type is missing -'
    },
    properties() {
      let list = _.pickBy(this.element, (value, key) => { return !!HIDDEN_PROPERTIES[key]}) 
      console.log('element.props', list)
      return list
    }
  },
  methods: {
    async editElement() {
      await this.$store.dispatch('status/dialog', {name: 'elementDialog', id: this.element.id});
    }
  },
}
</script>

<style scoped>
 
</style>

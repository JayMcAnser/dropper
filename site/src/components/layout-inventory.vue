<template>
  <v-card>
    <!--
    <v-toolbar extended>

      <v-toolbar-title>{{board.title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon
      >
        <v-icon @click="showFilter = !showFilter">mdi-magnify</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="showRightPanel"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

    </v-toolbar>
    -->

    <v-text-field
        dense
        v-model="filter"
    >
    </v-text-field>
    <v-divider></v-divider>


    <v-list>
      <element-list
          :elements="elements"
          @activate="activateElement"
      >
      </element-list>
    </v-list>
    <dialog-element></dialog-element>
    <dialog-element-new></dialog-element-new>

  </v-card>
</template>

<script>
import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

import {debug} from "@/vendors/lib/logging";
import ElementList from "@/components/element-list";
import DialogElement from "@/components/dialog-element";
import DialogElementNew from "@/components/dialog-element-new"
import {FilterWordSearch} from '../models/element-filters';

export default {
  name: "layout-inventory",
  components: {
    DialogElement,
    ElementList,
    DialogElementNew
  },
  data: function() {
    return {
      showFilter: false,
      filter: null,
      model:'the test',
    }
  },
  props: {
    board: {
      type: Object,
      required: true
    }
  },
  computed: {
    elements () {
      let filter = new FilterWordSearch(this.filter);
      debug(filter, 'layout-inventory');
      return this.board.inventory.children(filter).map(e => e.item);
    },
  },
  methods: {
    showRightPanel() {
      this.$store.dispatch('status/rightDrawer', true)
    },
    activateElement(element) {
      debug(element.id, 'layout-inventory.activate');
      this.$router.push({name: 'elementView', params: {boardId: this.board.id, elementId: element.id}})
    }
  },

}
</script>

<style scoped>

</style>

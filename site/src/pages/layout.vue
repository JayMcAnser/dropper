<template>
  <div>
    <component
        :is="componentType"
        :board="board"
        :element="layout"
    >
    </component>
  </div>
</template>

<script>

import {debug, warn} from '../vendors/lib/logging'
import Inventory from '../components/layout-inventory';

const LAYOUTS = {
  inventory: Inventory,
}
export default {
  name: 'boardsLayout',
  data: function() {
    return {
      board: {},
      layout: false
    }
  },
  components: {
    Inventory
  },
  computed: {
    componentType() {
      if (this.layout && LAYOUTS[this.layout.type]) {
        return LAYOUTS[this.layout.type]
      }
      warn(`unknown layout type: ${this.layout}`, 'page.layout')
      return null;
    }
  },
  methods:{
    async onRetry() {
      await this.$refs.boardList.refresh();
    }
  },
  async mounted() {
    let boardId = this.$route.params.id;
    let layout = this.$route.params.layout;
    if (this.$store.getters['board/active'].id !== boardId) {
      await this.$store.dispatch('board/active', {id: boardId})
    }
    this.board = this.$store.getters['board/active']
    this.layout = this.board.element(layout)
  }
}
</script>

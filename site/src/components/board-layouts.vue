<template>
  <v-card>
    <v-card-title>{{board.title}}</v-card-title>
    <v-list>
      <v-list-item
          v-for="layout in layouts" :key="layout.id"
          @click="openLayout(layout.id)"
      >
        <v-card-title>{{layout.title}}</v-card-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import {debug} from "@/vendors/lib/logging";

export default {
  name: "board-layouts",
  props: {
    board: {
      type: Object,
      required: true
    }
  },
  computed: {
    layouts() {
      return this.board.layouts()
    }
  },
  methods: {
    openLayout(id) {
      debug(`open layout ${id}`, 'board-layout')
      this.$router.push( {name: 'boardLayout', params: {id: this.board.id, layout: id}} )
    }
  }
}
</script>

<style scoped>

</style>

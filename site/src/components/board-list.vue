<template>
  <div>
    <h2>Board List</h2>
  <v-list two-line>
    <v-list-item v-for="board in boards" :key="board.id">
      <v-list-item-content 
      @click="openBoard(board.id)"
      >
        <v-list-item-title class="title">{{ board.title}}</v-list-item-title>
        {{ board.description }} ({{publicText(board.isPublic)}})
      </v-list-item-content>
      <v-list-item-action>
        <v-btn
            color="primary"
            fab
            x-small
            dark
            float-right
            @click="editBoard(board.id)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </v-list-item-action>

    </v-list-item>
  </v-list>
  </div>
</template>

<script>
 import { debug} from '../vendors/lib/logging';
/**
 * list the board available
 */
export default {
  name: "board-list",
  data: function() {
    return {
       boards: [],
    }
  },
  computed: {

  },
  methods: {
    publicText(isPublic) {
      return isPublic ? 'public' : 'private'
    },
    openBoard(id) {
      let url = `board/${id}`;
      // debug(`open board ${id}`)
      this.$router.push( {name: 'board', params: {id}} )
    },
    editBoard(id) {
      debug(`edit board ${id}`)
      this.$router.push( {name: 'boardEdit', params: {id}})  
    },
    async refresh() {
      try {
        this.boards = await this.$store.dispatch('board/list');        
      } catch (e) {
        this.boards = []
      }
    }
  },
  async mounted() {
    this.refresh();
  }
}
</script>

<style scoped>
  .title {
    font-weight: bold;
  }
</style>

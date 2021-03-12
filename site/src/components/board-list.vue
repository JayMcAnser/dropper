<template>
  <v-card>
    <div>
      <v-toolbar>
        <v-toolbar-title>Boards</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
        ></v-text-field>
        <v-btn
            icon
            class="hidden-xs-only"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-toolbar>
    </div>

    <v-list two-line>
      <v-list-item v-for="board in boards" :key="board.id">
        <v-list-item-content
        @click="openBoard(board.id)"
        >
          <v-list-item-title class="title">{{ board.title}}<div class="title-right"><v-icon>{{publicIcon(board)}}</v-icon></div></v-list-item-title>
          <v-list-item>
            <div class="description">{{ board.description }}</div>
          </v-list-item>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
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
    publicIcon(board) {
      if (board.isPublic) {
        return ''
      }
      return 'mdi-shield-lock';
    },
    async openBoard(id) {
      let url = `board/${id}`;
      // debug(`open board ${id}`)
      await this.$store.dispatch('board/activate', {id})
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
    await this.refresh();
  }
}
</script>

<style scoped>
  .title {
    font-weight: bold;
  }
  .title-right {
    display: inline;
    float: right;
  }
  .description {
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>

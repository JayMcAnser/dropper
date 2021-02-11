<template>
  <div class="page">
    <board-bar
      :columns="columns"
    ></board-bar>  
    <h2>Board {{ board.title}}</h2>
    <column-view
      :column="column"
    ></column-view>
    <error-dialog
      @retry="onRetry"
      @cancel="onCancel"
    ></error-dialog>
  </div>
</template>

<script>

import BoardBar from '../components/board-bar.vue'
import ColumnView from '../components/column-view.vue'
import ErrorDialog from '../vendors/components/error-dialog.vue'
import {debug, error} from '../vendors/lib/logging'

 
export default {
  name: 'Board',
  data: function() {
    return {    
          
    }
  },
  params: {
    id: String
  },
  components: {
    BoardBar,
    ColumnView,    
    ErrorDialog
  },
  computed: {
    board() {
      let board = this.$store.getters['board/active'];
      // debug(`loading board ${JSON.stringify(board)}`) 
      return this.$store.getters['board/active'];
    },
    columns() {
      let columns = this.$store.getters['board/columns'];
      // debug(`loading columns ${JSON.stringify(columns)}`) 
      return this.$store.getters['board/columns'];
    },
    column() {
      let column = this.$store.getters['board/column'];
      // debug(`column: ${JSON.stringify(column)}`)
      return this.$store.getters['board/column']
    }    
  },
  methods: {
    async onRetry() {
      debug(`retry error`)
      await this.reload()
    },  
    async onCancel() {
      debug(`cancel error`)
      this.$router.go(-1)
    },
    async reload() {
      // debug(`activate board`)
      await this.$store.dispatch('board/activate', {id: this.$route.params.id}) 
    }

  },

  async updated() {
    await this.reload();
  },
  async mounted() {
    try {
      // debug('route changed', 'board.mounted')
      await this.reload();      
    } catch(e) {
      error(e, 'page.board')
    }
    
  }
}
</script>
<style scoped>
  .page {
    margin-top: 62px  
  }
</style>
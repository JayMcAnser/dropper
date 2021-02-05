<template>
  <div>
    <app-bar></app-bar>
    <board-list
      ref="boardList"
    ></board-list>
    <error-dialog
      @retry="onRetry"
    ></error-dialog>
  </div>
</template>

<script>
import AppBar from '../components/app-bar.vue'
import BoardList from '../components/board-list.vue'
import ErrorDialog from '../components/error-dialog.vue'
// import {debug} from '../lib/logging'

export default {
  name: 'Boards',
  components: {    
    AppBar,
    BoardList,
    ErrorDialog
  },
  methods:{
     async onRetry() {
      await this.$refs.boardList.refresh();
    }
  }
}
</script>

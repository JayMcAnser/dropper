<template>
  <div>
    <app-bar></app-bar>
    <board-list
      ref="boardList"
    ></board-list>

    <bottom-bar
      @modeChange="modeChange"
      :show-sub-bar="bottomSheet">
    </bottom-bar>

    <dialog-board
        :board="board"
    ></dialog-board>
    <error-dialog
        @retry="onRetry"
    ></error-dialog>
  </div>
</template>

<script>
import AppBar from '../components/app-bar.vue'
import BoardList from '../components/board-list.vue'
import ErrorDialog from '../vendors/components/error-dialog.vue'
import BottomBar from "@/components/bottom-bar";
import DialogBoard, {BOARD_EDIT} from "@/components/dialog-board";
import LayoutInventory from "@/components/layout-inventory";
import {warn} from "@/vendors/lib/logging";
// import {debug} from '../lib/logging'

export default {
  name: 'Boards',
  components: {
    DialogBoard,
    BottomBar,
    AppBar,
    BoardList,
    ErrorDialog
  },
   data: function() {
    return {
      bottomSheet: false,
      tab: null,
      board: {}
    }
  },
   methods: {
    // ToDo: Error trapping retry/cancel
    onCancel() {warn('cancel not implemented', 'search')},
    async modeChange(mode) {
      switch (mode) {
        case 'addMenu':  // +
          await this.$store.dispatch('board/create', {});
          this.board = this.$store.getters['board/active'];
          await this.$store.dispatch('status/dialog', {name: BOARD_EDIT, mode: 'new'});
          break;
        default:
          warn(`modeChange ${mode} not implemented`, 'search')
      }
    },
    boardAdd(type) {
      warn('elementAdd not implemented', 'search')
    },
    async onRetry() {
      await this.$refs.boardList.refresh();
    }
  },
}
</script>

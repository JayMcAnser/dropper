<template>
  <div class="page">
    <board-bar></board-bar>
    <board-layouts
      :board="board">
    </board-layouts>



    <error-dialog
      @retry="onRetry"
      @cancel="onCancel"
    ></error-dialog>

    <dialog-board
        :board="board"
    >
    </dialog-board>

    <bottom-bar
        @modeChange="modeChange"
    >

    </bottom-bar>
  </div>
</template>

<script>

import BoardBar from '../components/board-bar.vue'

import ColumnView from '../components/column-view.vue'
import ErrorDialog from '../vendors/components/error-dialog.vue'
import {debug, error, warn} from '../vendors/lib/logging'
import LayoutInventory from "@/components/layout-inventory";
import BoardLayouts from "@/components/board-layouts";
import BottomBar from "@/components/bottom-bar";
import BoardEdit from "@/pages/board-edit";
import DialogBoard, {BOARD_EDIT} from '@/components/dialog-board';

const LOC = 'board'

export default {
  name: 'Board',
  data: function() {
    return {
      columnDialog: false
    }
  },
  params: {
    id: String
  },
  components: {
    DialogBoard,
    BoardEdit,
    BottomBar,
    LayoutInventory,
    BoardLayouts,
    BoardBar,
    ColumnView,
    ErrorDialog
  },
  computed: {
    board() {
      return this.$store.getters['board/active']
    },
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
    async modeChange(mode) {
      const LOC = 'element-view';
      try {
        switch (mode) {
          case 'edit':
            debug('switch to edit', LOC)
            await this.$store.dispatch('status/dialog', {name: BOARD_EDIT, id: this.board.id});
            break;
          case 'view':
            debug('switch to view',)
            await this.$store.dispatch('status/modeView');
            break
          case 'addMenu':
            // if in edit mode we do: add to element
            // otherwise we do add to board
            await this.$store.dispatch('status/dialog', {name: BOARD_EDIT, mode: 'new'});
            break;
          case 'search':
            await this.$router.push('/search')
            break;
          case 'browse':
            this.bottomSheet = true;
            break
          default:
            warn(`unknown mode ${mode}`, LOC)
        }
      } catch (e) {
        // the error is handled by the dispatch('status/...')
      }
    }
  },

}
</script>
<style scoped>
  .page {
    margin-top: 62px
  }
</style>

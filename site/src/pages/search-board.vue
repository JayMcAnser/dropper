<template>
  <div class="page">
    <v-card-title class="text-center justify-center py-6">
      Search
    </v-card-title>
    <v-card>
      <board-list></board-list>
    </v-card>

    <bottom-bar
        @modeChange="modeChange"
        :show-sub-bar="bottomSheet"
    >
    </bottom-bar>

    <dialog-board
        :board="board"
        @a
    ></dialog-board>
    <error-dialog
        @retry="onRetry"
        @cancel="onCancel"
    ></error-dialog>

  </div>
</template>

<script>
import {warn, debug} from '@/vendors/lib/logging';

import ErrorDialog from "@/vendors/components/error-dialog";
import BottomBar from "@/components/bottom-bar";
import LayoutInventory from "@/components/layout-inventory";
import BoardList from "@/components/board-list";
import DialogBoard, {BOARD_EDIT} from "@/components/dialog-board";

export default {
  name: "search",
  data: function() {
    return {
      bottomSheet: false,
      tab: null,
      _board: {}
    }
  },
  computed: {
  },
  components: {DialogBoard, BoardList, LayoutInventory, BottomBar, ErrorDialog},
  methods: {
    // ToDo: Error trapping retry/cancel
    onRetry() {warn('retry not implemented', 'search')},
    onCancel() {warn('cancel not implemented', 'search')},
    async modeChange(mode) {
      switch (mode) {
        case 'addMenu':  // +
          await this.$store.dispatch('status/dialog', {name: BOARD_EDIT, mode: 'new'});
          break;
        default:
          warn(`modeChange ${mode} not implemented`, 'search')
      }
    },
    boardAdd(type) {
      warn('elementAdd not implemented', 'search')
    }
  },
}
</script>

<style scoped>

</style>

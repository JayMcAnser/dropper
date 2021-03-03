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
    <dialog-element>
    </dialog-element>
  </div>
</template>

<script>

import BoardBar from '../components/board-bar.vue'
import DialogElement from '../components/dialog-element.vue'
import ColumnView from '../components/column-view.vue'
import ErrorDialog from '../vendors/components/error-dialog.vue'
import {debug, error} from '../vendors/lib/logging'
import LayoutInventory from "@/components/layout-inventory";
import BoardLayouts from "@/components/board-layouts";


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
    LayoutInventory,
    BoardLayouts,
    BoardBar,
    ColumnView,
    ErrorDialog,
    DialogElement
  },
  computed: {
    board() {
      return this.$store.getters['board/active']
    },
    // columns() {
    //   if (this.isLoaded) {
    //     // let columns = this.$store.getters['board/columns'];
    //     //debug(`loading columns ${JSON.stringify(columns)}`)
    //     return this.$store.getters['board/columns'];
    //   } else {
    //     return []
    //   }
    // },
    // column() {
    //   if (this.isLoaded) {
    //     let column = this.$store.getters['board/column'];
    //     debug(`column: ${JSON.stringify(column)}`)
    //     return column
    //   } else {
    //     return {}
    //   }
    // }

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
  },

}
</script>
<style scoped>
  .page {
    margin-top: 62px
  }
</style>

<template>
  <div class="page">
    <div
        id="factory">
      <element-factory
          :element="element">
      </element-factory>
    </div>
    <!--
    <v-bottom-sheet
        attach="factory"
        v-model="bottomSheet"
    >
      WHAT IS THIS
      <v-btn
          icon
          @click="viewNav('board')"
      >
        <v-icon>mdi-billboard</v-icon>
      </v-btn>
    </v-bottom-sheet>
    -->
    <bottom-bar
        @modeChange="modeChange"
        :show-sub-bar="bottomSheet"
        >
    </bottom-bar>
    <dialog-element-new
        @add="elementAdd"
    >
    </dialog-element-new>

    <error-dialog
        @retry="onRetry"
        @cancel="onCancel"
    ></error-dialog>

  </div>
</template>

<script>
import {debug, warn} from "@/vendors/lib/logging";
import BottomBar from "@/components/bottom-bar";
import ElementFactory from "@/components/element-factory";
import ErrorDialog from "@/vendors/components/error-dialog";
import DialogElementNew from "@/components/dialog-element-new";

export default {
  name: "element-view",
  data: function() {
    return {
      board: undefined,
      elementId: undefined,
      bottomSheet: false,
    }
  },
  components: {DialogElementNew, ElementFactory, ErrorDialog, BottomBar},
  computed: {
    element() {
      if (this.board) {
        return this.board.element(this.elementId)
      }
      return null;
    },
    isEdit() {
      debug(`edit mode ${this.$store.getters['status/isModeEdit']}`)
      return this.$store.getters['status/isModeEdit']
    },
  },
  async created() {
    // debug(this.$route.params.boardId, 'element-view.boardId')
    await this.$store.dispatch('board/activate', {id: this.$route.params.boardId})
    this.board = this.$store.getters['board/active'];
    // debug(`board: ${this.board.id}`, 'view.create')
    this.elementId = this.$route.params.elementId;
    if (!this.elementId) {
      warn(`missing elementId for param`,'page.view');
    }
  },
  methods: {
    async elementAdd(elementType) {
      let newElement = await this.board.elementCreate({type:elementType, key: `${elementType}.${this.board.elementCount}`});
      this.elementId = newElement.id
      await this.$store.dispatch('status/dialog');
      await this.$store.dispatch('status/modeEdit');
      // this.$store.dispatch('status/dialog', {name: 'elementDialog', id: element.id})
    },
    async modeChange(mode) {
      const LOC = 'element-view';
      try {
        switch (mode) {
          case 'edit':
            debug('switch to edit', LOC)
            await this.$store.dispatch('status/modeEdit');
            break;
          case 'view':
            debug('switch to view', )
            await this.$store.dispatch('status/modeView');
            break
          case 'addMenu':
            // if in edit mode we do: add to element
            // otherwise we do add to board
            await this.$store.dispatch('status/dialog', {name: 'elementNew', mode: this.isEdit ? 'element' : 'board'});
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
      // if (mode === 'cancel') {
      //   await this.board.cancel()
      // } else if (mode === 'browse') {
      //   this.bottomSheet = true
      // } else if (mode === 'add') {
      //   await this.$store.dispatch('status/dialog', {name: 'elementNew', id:-1});
      // }
    },
    viewNav(where) {
      switch(where) {
        case 'boards':
          this.$router.push({name: 'boards'})
      }
      this.bottomSheet = false;
    },
    async onRetry() {
      debug(`retry error`)
      await this.$store.dispatch('status/clear')
      // await this.reload()
    },
    async onCancel() {
      debug(`cancel error`)
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>

</style>

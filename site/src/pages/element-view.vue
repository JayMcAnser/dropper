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
        @modeChange="switchMode"
        >
    </bottom-bar>
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

export default {
  name: "element-view",
  data: function() {
    return {
      board: undefined,
      elementId: undefined,
      bottomSheet: false,
    }
  },
  components: {ElementFactory, ErrorDialog, BottomBar},
  computed: {
    element() {
      if (this.board) {
        return this.board.element(this.elementId)
      }
      return null;
    },
  },
  async created() {
    debug(this.$route.params.boardId, 'element-view.boardId')
    await this.$store.dispatch('board/activate', {id: this.$route.params.boardId})
    this.board = this.$store.getters['board/active'];
    debug(`board: ${this.board.id}`, 'view.create')
    this.elementId = this.$route.params.elementId;
    if (!this.elementId) {
      warn(`missing elementId for param`,'page.view');
    }
  },
  methods: {
    async switchMode(mode) {
      if (mode === 'cancel') {
        await this.board.cancel()
      } else if (mode === 'browse') {
        this.bottomSheet = true
        //await this.board.save();
      }
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

<template>
  <div>
    <v-bottom-navigation
        ref="bottomBar"
        absolute
        grow

    >
      <!-- grow: change with used -->
      <v-btn value="browse">
        <span>browse</span>
        <v-icon>mdi-view-carousel-outline</v-icon>
      </v-btn>
      <v-btn value="xx">
        <span></span>
        <v-icon></v-icon>
      </v-btn>
      <v-btn value="add" >
        <span>Add</span>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn>
      <span></span>
      <v-icon></v-icon>
      </v-btn>
      <!-- toggle the edit / view state -->
      <v-btn @click="doClick('editMode')" v-show="!isEdit">
        <span>Edit</span>
        <v-icon>mdi-notebook-edit-outline</v-icon>
      </v-btn>
      <v-btn @click="doClick('viewMode')"  v-show="isEdit" >
        <span>View</span>
        <v-icon>mdi-view-dashboard-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-bottom-sheet
        v-model="test"

    >
      <v-sheet
          class="upper-bar"
         :style="cssVars"
      >
        <v-bottom-navigation
        >
          <v-btn
            icon
            @click="viewNav('board')"
          >
            <v-icon>mdi-billboard</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </v-sheet>
    </v-bottom-sheet>
  </div>

</template>

<script>
import {debug} from '@/vendors/lib/logging'
export default {
  name: "bottom-bar",
  data: function() {
    return {
      test: false,
      barHeight: '20'
    }
  },
  computed: {
    isEdit() {
      return this.$store.getters['status/isModeEdit']
    },
    cssVars() {
      return {
        'margin-bottom': this.barHeight + 'px'
      }
    }

  },
  methods: {
    async doClick(value) {
      try {
        switch (value) {
          case 'viewMode':
            debug('switch to view', 'bottom-bar')
            await this.$store.dispatch('status/modeView');
            break;
          case 'editMode':
            debug('switch to edit', 'bottom-bar')
            await this.$store.dispatch('status/modeEdit');
            break;
        }
        debug(`emit. got ${value}`, 'bottom-bar')
        this.$emit('modeChange', value)
      } catch (e) {
        // error is not important: is allready handled by the element-view
      }
    }
  },
  updated() {
    debug(this.$refs.bottomBar.height, 'bar height')
    this.barHeight = this.$refs.bottomBar.height + 30
  }
}
</script>

<style scoped>

</style>

<template>
  <div>
    <v-bottom-navigation
        ref="bottomBar"
        absolute
        grow
        :style="{height: calcHeight}"
    >
      <!-- grow: change with used -->
      <v-btn value="browse"
             @click="doClick('browse')"
      >
        <span>browse</span>
        <v-icon>mdi-view-carousel-outline</v-icon>
      </v-btn>
      <v-btn value="xx">
        <span></span>
        <v-icon></v-icon>
      </v-btn>
      <v-btn
          @click="doClick('addMenu')" >
        <span>Add</span>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn>
      <span></span>
      <v-icon></v-icon>
      </v-btn>
      <!-- toggle the edit / view state -->
      <v-btn @click="doClick('edit')" v-show="!isEdit">
        <span>Edit</span>
        <v-icon>mdi-notebook-edit-outline</v-icon>
      </v-btn>
      <v-btn @click="doClick('view')"  v-show="isEdit" >
        <span>View</span>
        <v-icon>mdi-view-dashboard-outline</v-icon>
      </v-btn>
    </v-bottom-navigation>


    <v-bottom-sheet
        v-model="showSubBar"
    >
      <v-sheet
          class="upper-bar"
         :style="cssVars"
      >
        <v-bottom-navigation
        >
          THIS IS IN THE BOTTOM BAR
          <slot name="content"></slot>
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
      barHeight: 0
    }
  },
  props:{
    showSubBar :{
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    calcHeight() {
      return '56px'
    },
    isEdit() {
      return this.$store.getters['status/isModeEdit']
    },
    cssVars() {
      return {
        'margin-bottom': this.barHeight * (this.showSubBar ? 2 : 1) + 'px'
      }
    }

  },
  methods: {
    async doClick(value) {
      this.$emit('modeChange', value);
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

<template>
  <v-bottom-navigation
      absolute
      @change="doClick"
  >
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
    <v-btn value="editMode" v-show="!isEdit">
      <span>Edit</span>
      <v-icon>mdi-notebook-edit-outline</v-icon>
    </v-btn>
    <v-btn value="viewMode"  v-show="isEdit" >
      <span>View</span>
      <v-icon>mdi-view-dashboard-outline</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import {debug} from '@/vendors/lib/logging'
export default {
  name: "bottom-bar",
  data: function() {
    return {
    }
  },
  computed: {
    isEdit() {
      return this.$store.getters['status/isModeEdit']
    }
  },
  methods: {
    async doClick(value) {
      switch (value) {
        case 'viewMode':
          await this.$store.dispatch('status/modeView');
          break;
        case 'editMode':
          await this.$store.dispatch('status/modeEdit');
          break;
      }
      this.$emit('modeChange', value)
      //debug(`state: ${this.$store.getters['status/isModeEdit']}, value: ${value}`, 'bottom-bar.click')
    }
  }
}
</script>

<style scoped>

</style>

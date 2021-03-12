<template>
  <v-slide-y-reverse-transition>
    <div
      v-if="visible"
      class="drp-panel"
      v-click-outside="onClickOutside"
  >
    <div class="body rounded-sm">
      <slot ></slot>
    </div>
    </div>
  </v-slide-y-reverse-transition>
</template>

<script>
import {debug} from '@/vendors/lib/logging'
export default {
  name: "drp-panel",
  data: function() {
    return {
      visible: false,
      nextOutside: false
    }
  },
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  watch: {
    value(newVal) {
      this.visible = newVal
    }
  },
  methods: {
    onClickOutside() {
      this.visible = false;
      this.nextOutside = false;
      this.$emit('onClose')
    }
  }

}
</script>

<style scoped>
  .drp-panel {
    width: 100%;
    padding: 0 20px;
    position: absolute;
    bottom: 66px;

  }
  .drp-panel .body {
    #background-color: yellow;
    border: 1px gray solid;
    #padding: 20px;

  }
</style>

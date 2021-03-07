<template>
  <div>
    <component
        :is="componentType"
        :element="element"

    >
    </component>
  </div>
</template>

<script>
import {debug, warn} from "@/vendors/lib/logging";

export default {
  name: "element-factory",
  data: function() {
    return {
      viewLayouts: null,
      editLayouts: null,
    }
  },
  props: {
    'element': {
      type: Object,
      require: true
    }
  },
  computed: {
    isEdit() {
      debug(`edit mode ${this.$store.getters['status/isModeEdit']}`)
      return this.$store.getters['status/isModeEdit']
    },
    componentType() {
      if (this.element) {
        if (this.isEdit) {
          if (this.editLayouts.has(this.element.type)) {
            return this.editLayouts.get(this.element.type)
          }
          warn(`unknown element type: ${this.element}`, 'edit')
        } else {
          if (this.viewLayouts.has(this.element.type)) {
            return this.viewLayouts.get(this.element.type)
          }
          warn(`unknown element type: ${this.element}`, 'view')
        }
      }
      return null;
    }
  },
  created() {
    this.viewLayouts = new Map();
    this.viewLayouts.set('text',   () => import(/* webpackChunkName: "view-text" */ '@/components/view-text'))
    this.viewLayouts.set('unknown', () => import(/* webpackChunkName: "view-text" */ '@/components/view-unknown'))

    this.editLayouts = new Map();
    this.editLayouts.set('text',  () => import(/* webpackChunkName: "edit-text" */ '@/components/edit-text'));
    this.editLayouts.set('unknown', () => import(/* webpackChunkName: "view-text" */ '@/components/view-unknown'))
  }
}

</script>

<style scoped>

</style>

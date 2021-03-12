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
export default {
name: "edit-factory"
}
</script>

<style scoped>

</style>

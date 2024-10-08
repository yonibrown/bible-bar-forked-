<template>
  <div class="menu" :style="{ top: offset - 9 + 'px' }">
    <menu-button type="add" @click="$emit('openNewLine')"></menu-button>
  </div>
</template>

<script setup>
const props = defineProps(["offset"]);
</script>

<style scoped>
.menu {
  position: absolute;
  left: 25px;
  border: solid 1px #a7a7a7;
  box-shadow: 0 1px 4px #00000042;
  padding: 3px;
  background-color: white;
}
</style>

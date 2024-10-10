<template>
  <div class="menu" :style="{ top: offset - 9 + 'px' }">
    <menu-button
      type="moveup"
      v-show="lineIdx > 0"
      @click="$emit('moveup')"
    ></menu-button>
    <menu-button
      type="movedown"
      v-show="lineIdx >= 0 && lineIdx < linesLength - 1"
      @click="$emit('movedown')"
    ></menu-button>
    <menu-button type="add" @click="$emit('openNewLine')"></menu-button>
    <menu-button
      type="close"
      v-show="lineIdx >= 0"
      @click="$emit('deleteLine')"
    ></menu-button>
  </div>
</template>

<script setup>
import { inject } from "vue";

const props = defineProps(["offset", "lineIdx"]);

const linesLength = inject("linesLength");
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

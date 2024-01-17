<template>
  <base-draggable :data="{ wordIdx }">
    <span class="divider draggable-head" v-show="wordIdx == dividerWordIdx"
      >|</span
    >
  </base-draggable>
  <base-droppable
    :drop="setDividerOnWord"
    :dragStruct="['wordIdx']"
    :dragEnter="enterWord"
    :dragLeave="leaveWord"
  >
    <span>{{ word }}</span>
  </base-droppable>
</template>

<script setup>
import { ref, inject } from "vue";
const props = defineProps(["word", "wordIdx"]);
const dividerWordIdx = inject("dividerWordIdx");
const setDivider = inject("setDivider");

function setDividerOnWord() {
  setDivider.value(props.wordIdx);
}

const hilightMenu = ref(false);

function enterLinksMenu() {
  hilightMenu.value = true;
}
function leaveLinksMenu() {
  hilightMenu.value = false;
}
</script>

<style scoped>
.divider {
  color: blue;
  cursor: col-resize;
}
</style>

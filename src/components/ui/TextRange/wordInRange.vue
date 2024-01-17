<template>
  <base-draggable
    :data="{ wordDivider: 'from' }"
    v-show="wordIdx == dividerFromIdx"
  >
    <span class="divider draggable-head">|</span>
  </base-draggable>
  <base-droppable
    :drop="setDividerOnWord"
    :dragStruct="['wordIdx']"
    :dragEnter="enterWord"
    :dragLeave="leaveWord"
  >
    <span :class="{ hiWord: wordHilighted }">{{ word }}</span>
  </base-droppable>
  <base-draggable
    :data="{ wordDivider: 'to' }"
    v-show="wordIdx == dividerToIdx"
  >
    <span class="divider draggable-head">|</span>
  </base-draggable>
</template>

<script setup>
import { computed, inject } from "vue";
const props = defineProps(["word", "wordIdx"]);
const dividerFromIdx = inject("dividerFromIdx");
const dividerToIdx = inject("dividerToIdx");
const setDivider = inject("setDivider");
const hilightWord = inject("hilightWord");
const hilightFromWordIdx = inject("hilightFromWordIdx");
const hilightToWordIdx = inject("hilightToWordIdx");

const wordHilighted = computed(function () {
  return (
    props.wordIdx >= hilightFromWordIdx.value &&
    props.wordIdx <= hilightToWordIdx.value
  );
});

function setDividerOnWord(dragData) {
  console.log('dragData',dragData);
  setDivider(props.wordIdx);
}

function enterWord() {
  hilightWord(props.wordIdx);
}
function leaveWord() {
  // hilightWord(props.wordIdx);
}
</script>

<style scoped>
.divider {
  color: blue;
  cursor: col-resize;
}

.hiWord {
  background-color: rgb(204, 233, 233);
}
</style>

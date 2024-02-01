<template>
  <base-draggable
    :data="{ wordDivider: 'from' }"
    v-show="wordIdx == dividerFromIdx"
  >
    <span class="divider draggable-head">|</span>
  </base-draggable>
  <base-droppable
    :drop="setDividerOnWord"
    :dragStruct="['wordDivider']"
    :dragEnter="enterWord"
    :dragLeave="leaveWord"
  >
    <span :class="{ hiWord: !wordHilighted }">{{ word }}</span>
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
    props.wordIdx >= dividerFromIdx.value && props.wordIdx <= dividerToIdx.value
  );
});

function setDividerOnWord(dragData) {
  setDivider(props.wordIdx, dragData.wordDivider);
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
  font-size: 150%;
  cursor: col-resize;
  padding: 0 5px;
}

.hiWord {
  /* background-color: rgb(204, 233, 233); */
  color: gray;
}
</style>

<template>
  <span>
    <base-draggable :data="{ wordDivider: 'from' }" v-show="displayFromDivider">
      <span class="divider draggable-head">|</span>
    </base-draggable>
    <base-droppable
      :drop="setDividerOnWord"
      :dragStruct="['wordDivider']"
      :dragEnter="enterWord"
      :dragLeave="leaveWord"
    >
      <span class="bible-text" :class="wordClass">{{ word }}</span>
    </base-droppable>
    <base-draggable :data="{ wordDivider: 'to' }" v-show="displayToDivider">
      <span class="divider draggable-head">|</span>
    </base-draggable>
  </span>
</template>

<script setup>
import { computed, inject } from "vue";
const props = defineProps(["word", "wordIdx"]);
const dividerFromIdx = inject("dividerFromIdx");
const dividerToIdx = inject("dividerToIdx");
const setDivider = inject("setDivider");
const hilightWord = inject("hilightWord");
const disabled = inject("disabled");

const wordClass = computed(function () {
  return props.wordIdx >= dividerFromIdx.value &&
    props.wordIdx <= dividerToIdx.value
    ? "inWord"
    : "outWord";
});

const displayFromDivider = computed(function () {
  return !disabled.value && props.wordIdx == dividerFromIdx.value;
});

const displayToDivider = computed(function () {
  return !disabled.value && props.wordIdx == dividerToIdx.value;
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

.inWord {
  /* background-color: rgb(204, 233, 233); */
  font-weight: bold;
}
.outWord {
  /* background-color: rgb(204, 233, 233); */
  color: gray;
}
</style>

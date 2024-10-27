<template>
  <span>
    <base-draggable :data="{ wordDivider: 'from' }" v-show="displayFromDivider">
      <draggable-head>
        <span class="divider">|</span>
      </draggable-head>
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
      <draggable-head>
        <span class="divider">|</span>
      </draggable-head>
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
const editMode = inject("editMode");
const displayWholeVerse = inject("displayWholeVerse");

const wordClass = computed(function () {
  if (props.wordIdx >= dividerFromIdx.value &&
  props.wordIdx <= dividerToIdx.value){
    return "inWord";
  }

  if (displayWholeVerse.value){
    return "outWord";
  }

  if (editMode.value){
    return "wordToHide";
  }

  return "hiddenWord";
});

const displayFromDivider = computed(function () {
  return editMode.value && props.wordIdx == dividerFromIdx.value;
});

const displayToDivider = computed(function () {
  return editMode.value && props.wordIdx == dividerToIdx.value;
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
  font-weight: bold;
}
.outWord {
  color: gray;
}
.wordToHide {
  color: gray;
  text-decoration: line-through;
}
.hiddenWord {
  display: none;
}
</style>

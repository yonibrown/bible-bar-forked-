<template>
  <verse-editable
    :initial-value="fromVerse"
    placeholder="פסוק"
    :initPosition="part.src_from_position"
    :disabled="!enableSelection"
    @submitValue="(attr) => updateVerse('from', attr)"
  ></verse-editable>
  <span v-if="displayOneVerse">
    <button class="disp-range" v-show="enableSelection" @click="displayRange">
      טווח
    </button>
  </span>
  <span v-else>
    -
    <verse-editable
      :initial-value="toVerse"
      placeholder="פסוק"
      :initPosition="part.src_to_position"
      :disabled="!enableSelection"
      @submitValue="(attr) => updateVerse('to', attr)"
    ></verse-editable>
  </span>
</template>

<script setup>
import VerseEditable from "./VerseEditable.vue";
import { inject, computed, provide, ref } from "vue";

const props = defineProps(["part"]);
const emit = defineEmits(["changeValue"]);

const enableSelection = inject("enableSelection");

const seqIndex = computed(function () {
  return {
    res: props.part.src_research,
    col: props.part.src_collection,
    idx: 1,
  };
});
provide("seqIndex", seqIndex);

const displayOneVerse = ref(
  props.part.src_from_position == props.part.src_to_position
);
function displayRange() {
  displayOneVerse.value = false;
}

const fromVerse = computed(function () {
  return props.part.src_from_name.replaceAll(",", " ");
});

const toVerse = computed(function () {
  return props.part.src_to_name.replaceAll(",", " ");
});

var fromDiv = null;
var toDiv = null;

function updateVerse(rangeEnd, newVal) {
  // console.log(props.part);
  var updAttr = {};
  if (rangeEnd == "from" || displayOneVerse.value) {
    updAttr.src_from_div = newVal.div;
    updAttr.src_from_word = 0;
    fromDiv = newVal.div;
  }
  if (rangeEnd == "to" || displayOneVerse.value) {
    updAttr.src_to_div = newVal.div;
    updAttr.src_to_word = 999;
    toDiv = newVal.div;
  }

  if (fromDiv == toDiv) {
    displayOneVerse.value = true;
  }
  emit("changeValue", updAttr);
}
</script>

<style scoped>
.disp-range {
  margin-right: 5px;
}
</style>

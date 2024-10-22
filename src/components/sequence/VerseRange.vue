<template>
  <verse-editable
    :initialValue="fromName"
    placeholder="בחר פסוק..."
    :initPosition="fromPosition"
    :initDivision="fromDivision"
    :disabled="!editable"
    @submitValue="(attr) => updateVerse('from', attr)"
  ></verse-editable>
  <span v-if="displayOneVerse">
    <button class="disp-range" v-show="showRangeButton" @click="displayRange">
      טווח
    </button>
  </span>
  <span v-else>
    -
    <verse-editable
      :initialValue="toName"
      placeholder="בחר פסוק..."
      :initPosition="part.src_to_position"
      :initDivision="part.src_to_division"
      :disabled="!editable"
      @submitValue="(attr) => updateVerse('to', attr)"
    ></verse-editable>
  </span>
</template>

<script setup>
import VerseEditable from "./VerseEditable.vue";
import { computed, provide, ref } from "vue";

const props = defineProps(["part", "editable"]);
const emit = defineEmits(["changeValue"]);

const defaultIndex = { res: 1, col: 1, idx: 1 };
const defaultDivision = 972; /* Genesis,1,1 */

const showRangeButton = computed(function () {
  // return props.editable ;
  return props.editable && fromName.value != "";
});

const fromPosition = computed(function () {
  if (props.part) {
    return props.part.src_from_position;
  }
});

const fromDivision = computed(function () {
  if (props.part) {
    return props.part.src_from_division;
  }
});

const seqIndex = computed(function () {
  if (props.part) {
    return {
      res: props.part.src_research,
      col: props.part.src_collection,
      idx: 1,
    };
  }
  return defaultIndex;
});
provide("seqIndex", seqIndex);

const displayOneVerse = ref(
  !props.part
    ? true
    : props.part.src_from_division
    ? props.part.src_from_division == props.part.src_to_division
    : props.part.src_from_position == props.part.src_to_position
);
function displayRange() {
  displayOneVerse.value = false;
}

const fromName = computed(function () {
  if (props.part) {
    return props.part.src_from_name.replaceAll(",", " ");
  }
  return "";
});

const toName = computed(function () {
  if (props.part) {
    return props.part.src_to_name.replaceAll(",", " ");
  }
  return "";
});

var fromDiv = null;
var toDiv = null;

function updateVerse(rangeSide, newVal) {
  var updAttr = {};
  if (!props.part) {
    updAttr.src_index = defaultIndex;
  }
  if (rangeSide == "from" || displayOneVerse.value) {
    updAttr.src_from_division = newVal.div;
    updAttr.src_from_name = newVal.name;
    updAttr.src_from_word = 0;
    fromDiv = newVal.div;
  }
  if (rangeSide == "to" || displayOneVerse.value) {
    updAttr.src_to_division = newVal.div;
    updAttr.src_to_name = newVal.name;
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

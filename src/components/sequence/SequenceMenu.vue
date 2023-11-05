<template>
  <base-menu>
    <span>טקסט:</span>
    <select>
      <option value="1_1" selected="selected">נוסח המסורה</option>
    </select>
    <span>חלוקה:</span>
    <select>
      <option value="1" selected="selected">חלוקה לפרקים</option>
    </select>
    <!-- <input type="submit" :value="filterText" @click="toggleFilter"/> -->
    <span style="display: inline" v-show="displayFilter">
      <span>מ-</span>
      <sequence-key
        :initialValue="initialFromKey"
        @changeValue="(newVal) => updateAttr('from_div', newVal)"
        defaultValue="min"
      ></sequence-key>
      <span>עד</span>
      <sequence-key
        :initialValue="initialToKey"
        @changeValue="(newVal) => updateAttr('to_div', newVal)"
        defaultValue="max"
      ></sequence-key>
      <input
        v-if="enableWholeText"
        type="submit"
        value="כל הטקסט"
        @click="removeFilter"
      />
    </span>
    <span v-if="displayScale">
      <span>סקאלה:</span>
      <sequence-scale
        :initialValue="elementAttr.seq_level"
        @changeValue="(newVal) => updateAttr('seq_level', newVal)"
        defaultValue="min"
      ></sequence-scale>
    </span>
    <input
      type="submit"
      value="החל"
      @click="submitChanges"
      :disabled="!hasChanges"
    />
  </base-menu>
</template>

<script setup>
import SequenceKey from "./SequenceKey.vue";
import SequenceScale from "./SequenceScale.vue";

import { computed, provide, inject, ref } from "vue";

const props = defineProps(["elementAttr", "displayScale", "enableWholeText"]);

const changeAttr = inject("changeAttr");

const seqIndex = computed(function () {
  return {
    res: props.elementAttr.research_id,
    col: props.elementAttr.collection_id,
    idx: props.elementAttr.seq_index,
  };
});
provide("seqIndex", seqIndex);

var changedAttr = {};
const hasChanges = ref(false);

function updateAttr(attr, newVal) {
  hasChanges.value = true;
  changedAttr[attr] = newVal;
}

async function submitChanges() {
  if (Object.keys(changedAttr).length == 0) {
    return;
  }

  const fromKey = props.elementAttr.from_key;
  var fromDiv;
  if (changedAttr["from_div"] != null) {
    fromDiv = +changedAttr["from_div"];
  } else {
    fromDiv = +fromKey[fromKey.length - 1].division_id;
  }

  const toKey = props.elementAttr.to_key;
  var toDiv;
  if (changedAttr["to_div"] != null) {
    toDiv = +changedAttr["to_div"];
  } else {
    toDiv = +toKey[toKey.length - 1].division_id;
  }

  if (toDiv < fromDiv) {
    alert("טווח הפסוקים לא הגיוני");
    return;
  }

  if (!props.enableWholeText) {
    if (toDiv - fromDiv > 100) {
      alert("לא ניתן להציג יותר מ-100 פסוקים");
      // changedAttr['to_div'] = fromDiv + 100;
      return;
    }
  }
  changeAttr(changedAttr, { reload: true });
  // if only scale changed, we can reload only the segments

  changedAttr = {};
  hasChanges.value = false;
}

const displayFilter = ref(true);
function toggleFilter() {
  displayFilter.value = !displayFilter.value;
}
const filterText = computed(function () {
  return "מיקוד " + (displayFilter.value ? "<<" : ">>");
});

const initialFromKey = ref(props.elementAttr.from_key);
const initialToKey = ref(props.elementAttr.to_key);
function removeFilter() {
  initialFromKey.value = null;
  initialToKey.value = null;
}
</script>

<style scoped>
div * {
  margin-left: 6px;
}
</style>

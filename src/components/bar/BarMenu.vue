<template>
  <div>
    <span>טקסט:</span>
    <select>
      <option value="1_1" selected="selected">נוסח המסורה</option>
    </select>
    <span>חלוקה:</span>
    <select>
      <option value="1" selected="selected">חלוקה לפרקים</option>
    </select>
    <span>סקאלה:</span>
    <sequence-scale
        :initialValue="attr.seq_level"
        @changeValue="(newVal) => updateAttr('seq_level', newVal)"
        defaultValue="min"
      ></sequence-scale>
    <input type="submit" :value="filterText" @click="toggleFilter"/>
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
      <input type="submit" value="הסר מיקוד" @click="removeFilter"/>
    </span>
    <input
      type="submit"
      value="החל"
      @click="submitChanges"
      :disabled="!hasChanges"
    />
  </div>
</template>

<script setup>
import SequenceKey from '../sequence/SequenceKey.vue';
import SequenceScale from '../sequence/SequenceScale.vue';

import { computed, provide, inject, ref } from 'vue';

const props = defineProps(['element']);

const changeAttr = inject('changeAttr');

const attr = computed(function () {
  return props.element.attr;
});

const seqIndex = computed(function () {
  return {
    res: props.element.attr.research_id,
    col: props.element.attr.collection_id,
    idx: props.element.attr.seq_index,
  };
});
provide('seqIndex', seqIndex);

var changedAttr = {};
const hasChanges = ref(false);

function updateAttr(attr, newVal) {
  hasChanges.value = true;
  changedAttr[attr] = newVal;
}

async function submitChanges() {
  if (Object.keys(changedAttr).length == 0) {
    console.log('no change');
    return;
  }
  changeAttr(changedAttr);

  changedAttr = {};
  hasChanges.value = false;
}

const displayFilter = ref(false);
function toggleFilter(){
  displayFilter.value = !displayFilter.value;
}
const filterText = computed(function(){
  return 'מיקוד ' + (displayFilter.value ? '<<' : '>>');
});

const initialFromKey = ref(attr.value.from_key);
const initialToKey = ref(attr.value.to_key);
function removeFilter(){
  initialFromKey.value = null;
  initialToKey.value = null;
}
</script>

<style scoped>
div * {
  margin-left: 3px;
}
</style>

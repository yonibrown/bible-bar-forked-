<template>
  <select v-model="selected">
    <option
      v-for="lvl in indexLevels"
      :key="lvl.id"
      :value="lvl.id">
      {{ lvl.whole_name }}
    </option>
  </select>
</template>

<script setup>
import { watch, ref, inject, computed } from 'vue';
import { sendToServer } from '../../server.js';

const props = defineProps(['initialValue', 'defaultValue']);
const emit = defineEmits(['changeValue']);
const seqIndex = inject('seqIndex');

const indexLevels = ref([]);

const injectedSelectedLevel = computed(function(){
  return props.initialValue;
});
var injectedChange = false;

// initial value for 'selected'
const selected = ref(props.initialValue);

watch(injectedSelectedLevel,(newVal) => {
  if (selected.value != newVal){
    injectedChange = true;
    selected.value = newVal;
  }
});

watch(selected, (newVal) => {
  if (injectedChange){
    injectedChange = false;
  } else {
    changeScale(props.keyLvlIdx,newVal);
  }
});

loadIndex();

async function loadIndex() {
  const data = {
    type: 'res_index',
    oper: 'get',
    id: seqIndex.value,
    prop: {
      dummy: '',
    },
  };

  const obj = await sendToServer(data);

  indexLevels.value = obj.data.levels;
}

async function changeScale() {
  // update dependant inputs
  // nothing

  // emit changes
  emit('changeValue', selected.value);
}
</script>

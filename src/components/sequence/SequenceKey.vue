<template>
  <span>
    <seq-key-level
      v-for="(lvl, lvlIdx) in keyLevels"
      :key="lvlIdx"
      :keyLvl="lvl"
      :keyLvlIdx="lvlIdx"
    ></seq-key-level>
  </span>
</template>

<script setup>
import SeqKeyLevel from './SeqKeyLevel.vue';
import { sendToServer } from '../../server.js';
import { ref, inject, provide, computed,watch } from 'vue';
const props = defineProps(['initialValue', 'defaultValue']);
const emit = defineEmits(['changeValue']);

const defaultDiv = props.defaultValue == 'min' ? '0' : '-1';
const lastKeyIdx = props.initialValue.length - 1;

const selectedKey = [];

const initialKey = computed(function () {
  return props.initialValue;
});

const seqIndex = inject('seqIndex');

const keyLevels = ref([]);
provide('keyLevels', keyLevels);

initKey();
loadIndex();

watch(initialKey,function(){
  if (initialKey.value == null){
    changeKey(0,defaultDiv);
  } else {
    initKey();
    loadIndex();
  }
});

function initKey() {
  initialKey.value.forEach((lvl, lvlIdx) => {
    selectedKey[lvlIdx] = { ...lvl };
  });
}

async function loadIndex() {
  const data = {
    type: 'res_index',
    oper: 'get_divisions',
    id: seqIndex.value,
    prop: {
      key: selectedKey,
    },
  };

  const obj = await sendToServer(data);

  keyLevels.value = obj.data;
}

async function changeKey(lvlIdx, div) {
  // update div
  selectedKey[lvlIdx].division_id = div;

  // init divs in next levels
  for (let i = lvlIdx + 1; i < selectedKey.length; i++) {
    selectedKey[i].division_id = defaultDiv;
  }

  // refresh div lists
  if (lvlIdx + 1 < selectedKey.length) {
    await loadIndex();
  }

  // emit changes
  let selectedDiv = selectedKey[lastKeyIdx].division_id;
  if (selectedDiv == defaultDiv) {
    let divArr = keyLevels.value[lastKeyIdx].divisions;
    if (selectedDiv == '0') {
      selectedDiv = divArr[0].id;
    } else {
      selectedDiv = divArr[divArr.length - 1].id;
    }
  }
  emit('changeValue', selectedDiv);
}
provide('changeKey', changeKey);
</script>

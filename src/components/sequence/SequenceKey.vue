<template>
  <span>
    <seq-key-level
      v-for="(lvl, lvlIdx) in keyLevels"
      :key="lvlIdx"
      :keyLvl="lvl"
      :keyLvlIdx="lvlIdx"
      :changeKeyLevel="changeKeyLevel"
    ></seq-key-level>
  </span>
</template>

<script setup>
import SeqKeyLevel from "./SeqKeyLevel.vue";
import { ref, inject, computed, watch } from "vue";
import { biResearch } from "../../store/biResearch.js";

const props = defineProps(["initialValue", "defaultValue"]);
const emit = defineEmits(["changeValue"]);

const defaultDiv = props.defaultValue == "min" ? "0" : "-1";
const lastKeyIdx = props.initialValue.length - 1;

const selectedKey = [];

const initialKey = computed(function () {
  return props.initialValue;
});

const seqIndex = inject("seqIndex");

const keyLevels = ref([]);

updateKey(initialKey.value);
watch(initialKey, updateKey);

function clear() {
  changeKeyLevel(0, defaultDiv);
}

function updateKey(key) {
  // console.log(key);
  key.forEach((lvl, lvlIdx) => {
    selectedKey[lvlIdx] = {
      level: lvl.level,
      division_id: lvl.division_id,
    };
  });
  loadKey();
}

async function loadKey() {
  keyLevels.value = await biResearch.loadIndexDivisions(seqIndex.value, {
    key: selectedKey,
  });
}

async function changeKeyLevel(lvlIdx, div) {
  // update div
  selectedKey[lvlIdx].division_id = div;

  // init divs in next levels
  for (let i = lvlIdx + 1; i < selectedKey.length; i++) {
    selectedKey[i].division_id = defaultDiv;
  }

  // refresh div lists
  if (lvlIdx + 1 < selectedKey.length) {
    await loadKey();
  }

  // emit changes
  let selectedDiv = selectedKey[lastKeyIdx].division_id;
  if (selectedDiv == defaultDiv) {
    let divArr = keyLevels.value[lastKeyIdx].divisions;
    if (selectedDiv == "0") {
      selectedDiv = divArr[0].id;
    } else {
      selectedDiv = divArr[divArr.length - 1].id;
    }
  }
  emit("changeValue", selectedDiv);
}

function getKey() {
  const cloneKey = [];
  selectedKey.forEach((lvl, lvlIdx) => {
    cloneKey[lvlIdx] = { ...lvl };
  });
  return cloneKey;
}

defineExpose({ getKey, clear, updateKey });
</script>

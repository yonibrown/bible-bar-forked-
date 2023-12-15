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
const props = defineProps(["initialValue", "defaultValue"]);
const emit = defineEmits(["changeValue"]);
const resMethods = inject("resMethods");

const defaultDiv = props.defaultValue == "min" ? "0" : "-1";
const lastKeyIdx = props.initialValue.length - 1;

const selectedKey = [];

const initialKey = computed(function () {
  return props.initialValue;
});

const seqIndex = inject("seqIndex");

const keyLevels = ref([]);

initKey();
loadIndex();

watch(initialKey, function (newVal) {
  if (newVal == null) {
    changeKeyLevel(0, defaultDiv);
  } else {
    initKey();
    loadIndex();
  }
});

function initKey() {
  initialKey.value.forEach((lvl, lvlIdx) => {
    selectedKey[lvlIdx] = {
      level: lvl.level,
      division_id: lvl.division_id,
    };
  });
}

async function loadIndex() {
  keyLevels.value = await resMethods.loadIndexDivisions(
    seqIndex.value,
    selectedKey,
  );
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
    await loadIndex();
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

defineExpose({ getKey });
</script>

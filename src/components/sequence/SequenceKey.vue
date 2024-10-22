<template>
  <span>
    <seq-key-level
      v-for="(lvl, lvlIdx) in levels"
      :key="lvlIdx"
      :keyLvl="lvl"
      :keyLvlIdx="lvlIdx"
      @changeKeyLevel="changeKeyLevel"
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
// const lastKeyIdx = props.initialValue.length - 1;

const seqIndex = inject("seqIndex");

const levels = ref([]);
var selectedKey = [];

const initialKey = computed(function () {
  return props.initialValue;
});

// update selectedKey according to initialKey
updateKey(initialKey.value);

// update selectedKey according to initialKey after change
// watch(initialKey, updateKey);
watch(initialKey, function (newVal) {
  console.log("initialKey changed - update selectedKey");
  updateKey(newVal);
});

// update selectedKey according to the parameter
function updateKey(key) {
  console.log("update key", key);
  if (key) {
    key.forEach((lvl, lvlIdx) => {
      selectedKey[lvlIdx] = {
        level: lvl.level,
        division_id: lvl.division_id,
      };
    });
  }
  loadDivisions();
}

function clear() {
  console.log("clear");
  changeKeyLevel({ lvlIdx: 0, div: defaultDiv });
}

async function loadDivisions() {
  console.log("loadDivisions", seqIndex.value, selectedKey);
  levels.value = await biResearch.getDivisions(seqIndex.value, {
    key: selectedKey,
  });
  console.log("loadDivisions levels", levels.value);
}

async function changeKeyLevel({ lvlIdx, div }) {
  console.log("changeKeyLevel", div);
  // handle no choise
  if (div == -999) {
    selectedKey = [{ division_id: div }];

    for (let i = lvlIdx + 1; i < levels.value.length; i++) {
      levels.value[i].divisions = [];
    }
    emit("changeValue", { id: div, name: "" });
    return;
  }

  // update div
  selectedKey[lvlIdx].division_id = div;

  // init divs in next levels
  for (let i = lvlIdx + 1; i < selectedKey.length; i++) {
    selectedKey[i].division_id = defaultDiv;
  }

  // refresh div lists
  if (lvlIdx + 1 < selectedKey.length) {
    await loadDivisions();
  }

  // update selected div
  updateSelectedKey();

  // emit changes
  let selectedDiv = selectedKey[selectedKey.length - 1].division_id;

  let selectedName = selectedKey
    .map(function (lvl) {
      return lvl.division_name;
    })
    .join(" ");

  emit("changeValue", { id: selectedDiv, name: selectedName });
}

function updateSelectedKey() {
  console.log("updateSelectedKey");
  levels.value.forEach(function (lvl, idx) {
    if (selectedKey[idx].division_id == defaultDiv) {
      if (defaultDiv == 0) {
        selectedKey[idx].division_id = lvl.divisions[0].id;
      } else {
        selectedKey[idx].division_id =
          lvl.divisions[lvl.divisions.length - 1].id;
      }
    }
    selectedKey[idx].division_name = lvl.divisions.find(function (div) {
      return div.id == selectedKey[idx].division_id;
    }).name;
  });
}

function getKey() {
  console.log("getKey");
  const cloneKey = [];
  selectedKey.forEach((lvl, lvlIdx) => {
    cloneKey[lvlIdx] = { ...lvl };
  });
  return cloneKey;
}

defineExpose({ getKey, clear, updateKey });
</script>

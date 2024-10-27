<template>
  <select v-model="selected" v-show="divisions.length > 0">
    <option v-for="div in divisions" :value="div.id">
      {{ div.nameArr[1] }}
    </option>
  </select>
</template>

<script setup>
import { watch, ref, computed } from "vue";

const props = defineProps(["keyLvlIdx", "keyLvl"]);
const emit = defineEmits(["changeKeyLevel"]);
import { biResearch } from "../../store/biResearch.js";

console.log('keyLvlIdx',props.keyLvlIdx);
console.log('keyLvl',props.keyLvl);
console.log(biResearch.getReferenceStyles());
const divisions = computed(function () {
  const options = [];
  if (props.keyLvlIdx == 0) {
    options.push({
      id: -999,
      name: "בחר...",
      nameArr: ["בחר...","בחר...","בחר..."]
    });
  }

  return options.concat(props.keyLvl.divisions);
});

const injectedSelectedDiv = computed(function () {
  return props.keyLvl.selected_div;
});
var injectedChange = false;

// initial value for 'selected'
const selected = ref(injectedSelectedDiv.value);

watch(injectedSelectedDiv, (newVal) => {
  if (selected.value != newVal) {
    injectedChange = true;
    selected.value = newVal;
  }
});

watch(selected, (newVal) => {
  if (injectedChange) {
    injectedChange = false;
  } else {
    emit("changeKeyLevel", { lvlIdx: props.keyLvlIdx, div: newVal });
  }
});
</script>

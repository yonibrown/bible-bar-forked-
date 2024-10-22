<template>
  <select v-model="selected" v-show="divisions.length > 0">
    <option v-for="div in divisions" :value="div.id">
      {{ div.name }}
    </option>
  </select>
</template>

<script setup>
import { watch, ref, computed } from "vue";

const props = defineProps(["keyLvlIdx", "keyLvl"]);
const emit = defineEmits(["changeKeyLevel"]);

const divisions = computed(function () {
  const options = [];
  if (props.keyLvlIdx == 0) {
    options.push({
      id: -999,
      name: "בחר...",
    });
  }

  return options.concat(props.keyLvl.divisions);
});

const injectedSelectedDiv = computed(function () {
  return props.keyLvl.selected_div.id;
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

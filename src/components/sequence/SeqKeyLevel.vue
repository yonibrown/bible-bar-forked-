<template>
  <select v-model="selected">
    <option v-for="div in keyLvl.divisions" :value="div.id">
      {{ div.name }}
    </option>
  </select>
</template>

<script setup>
import { watch, ref, computed } from "vue";

const props = defineProps(["keyLvlIdx", "keyLvl"]);
const emit = defineEmits(['changeKeyLevel']);

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
    emit('changeKeyLevel',{ lvlIdx: props.keyLvlIdx, div: newVal });
  }
});
</script>

<template>
  <select v-model="selected">
    <option
      v-for="div in keyLvl.divisions"
      :value="div.id">
      {{ div.name }}
    </option>
  </select>
</template>

<script setup>
import { watch, ref, inject, computed } from 'vue';

const props = defineProps(['keyLvlIdx','keyLvl']);
const changeKey = inject('changeKey');

const injectedSelectedDiv = computed(function(){
  return props.keyLvl.selected_div;
});
var injectedChange = false;

// initial value for 'selected'
const selected = ref(injectedSelectedDiv.value);

watch(injectedSelectedDiv,(newVal) => {
  // console.log(props.keyLvlIdx+': div changed to '+newVal);
  if (selected.value != newVal){
    injectedChange = true;
    selected.value = newVal;
  }
});

watch(selected, (newVal) => {
  if (injectedChange){
    injectedChange = false;
  } else {
    // console.log(props.keyLvlIdx+': change div to '+newVal);
    changeKey(props.keyLvlIdx,newVal);
  }
});
</script>

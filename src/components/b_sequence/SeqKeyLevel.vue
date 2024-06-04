<template>
  <select v-model="selected">
    <option v-for="div in keyLvl" :value="div.id">
      {{ div.name }}
    </option>
  </select>
</template>

<script setup>
import { watch, ref, inject } from "vue";

const props = defineProps(["name"]);

const selected = ref(1);
const source = inject('source');

if (props.name == 'book'){
  
}

loadKey();
async function loadKey() {
  keyLvl.value = await source.loadKeyLevel({
    level: props.name,
    key: null,
  });
}
</script>

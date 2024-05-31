<template>
  <select v-model="selected">
    <option v-for="div in keyLvl" :value="div.id">
      {{ div.name }}
    </option>
  </select>
</template>

<script setup>
import { watch, ref, computed } from "vue";
import { biSource } from "../../store/biSource.js";

const props = defineProps(["name"]);

const selected = ref(1);

const keyLvl = ref([
  { id: 1, name: "א" },
  { id: 2, name: "ב" },
  { id: 3, name: "ג" },
]);

loadKey();
async function loadKey() {
  keyLvl.value = await biSource.loadKeyLevel({
    level: props.name,
    key: null,
  });
}
</script>

<template>
  <div class="options-box">
    <div>סגנון הפניה:</div>
    <label for="bookStyle">ספר</label>
    <select v-model="bookStyle" name="bookStyle">
      <option v-for="opt in bookOptions" :value="opt.value">
        {{ opt.name }}
      </option>
    </select>
    <label for="chapterStyle">פרק</label>
    <select v-model="chapterStyle" name="chapterStyle">
      <option v-for="opt in chapterOptions" :value="opt.value">
        {{ opt.name }}
      </option>
    </select>
    <label for="verseStyle">פסוק</label>
    <select v-model="verseStyle" name="verseStyle">
      <option v-for="opt in verseOptions" :value="opt.value">
        {{ opt.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";

const project = inject("project");

const bookStyle = ref(0);
const chapterStyle = ref(0);
const verseStyle = ref(0);

const bookOptions = [
  { value: 0, name: "מלכים א" },
  { value: 1, name: "מלכים א'" },
  { value: 2, name: 'מל"א' },
];
const chapterOptions = [
  { value: 0, name: "יח" },
  { value: 1, name: 'י"ח' },
];
const verseOptions = [
  { value: 0, name: "יב" },
  { value: 1, name: 'י"ב' },
  { value: 2, name: "12" },
];
</script>

<style scoped>
.options-box {
  padding: 10px;
}
label {
  margin: 5px;
}
</style>

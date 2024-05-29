<template>
  <div>sourceId:{{ element.sourceId }}</div>
  <div>fromPart:{{ element.fromPart }}</div>
  <div>toPart:{{ element.toPart }}</div>
  <base-scrollable class="bible-text">
    <div
      class="text-box"
      ref="textRef"
      style="
        font-size: 155%;
        font-family: David, sans-serif;
        text-align: justify;
        direction: rtl;
      "
    >
      <b-text-verse
        v-for="vrs in verses"
        :key="vrs.part_id"
        :verse="vrs"
      ></b-text-verse>
    </div>
  </base-scrollable>
</template>

<script setup>
import BTextVerse from "./BTextVerse.vue";
import { inject,ref,computed } from "vue";
const element = inject("element");

const textRef = ref();

const verses = computed(function () {
  if (!element.value || !element.value.verses) {
    return [];
  }
  return element.value.verses;
});

element.value.loadText();
</script>

<style scoped></style>

<template>
  <div v-show="displayOptions">
    <sequence-menu
      v-show="displayOptions"
      :displayScale="false"
      :enableWholeText="false"
    ></sequence-menu>
    <!-- <links-menu title="הדגשות"></links-menu> -->
    <!-- <text-menu @updateData="updateData"></text-menu> -->
  </div>
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
      <text-verse
        v-for="vrs in verses"
        :key="vrs.part_id"
        :verse="vrs"
      ></text-verse>
    </div>
  </base-scrollable>
</template>

<script setup>
import TextVerse from "./TextVerse.vue";
import SequenceMenu from "../b_sequence/SequenceMenu.vue";
import { inject,ref,computed } from "vue";

const element = inject("element");
const displayOptions = inject("displayOptions");

const textRef = ref();

const verses = computed(function () {
  if (!element.value || !element.value.verses) {
    return [];
  }
  return element.value.verses;
});

element.value.loadText();
</script>

<style scoped>
.text-box {
  padding: 15px;
}
</style>

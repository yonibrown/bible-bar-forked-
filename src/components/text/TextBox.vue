<template>
  <div v-show="displayOptions">
    <sequence-menu
      v-show="displayOptions"
      :displayScale="false"
      :enableWholeText="false"
    ></sequence-menu>
    <links-menu title="הדגשות"></links-menu>
    <text-menu></text-menu>
  </div>
  <div>
    <base-scrollable class="bible-text">
      <div class="text-box">
        <text-verse
          v-for="vrs in verses"
          :key="vrs.part_id"
          :verse="vrs"
        ></text-verse>
      </div>
    </base-scrollable>
  </div>
</template>

<script setup>
import TextMenu from "./TextMenu.vue";
import LinksMenu from "../link/LinksMenu.vue";
import SequenceMenu from "../sequence/SequenceMenu.vue";
import TextVerse from "./TextVerse.vue";
import { inject, ref } from "vue";

const displayOptions = inject("displayOptions");
const element = inject("element");
const elmMethods = inject("elmMethods");

const verses = ref([]);

loadElmText();

async function loadElmText() {
  verses.value = await elmMethods.loadText(element.value);
}

defineExpose({ reload: loadElmText });
</script>

<style scoped>
.text-box{
  padding:15px;
}
</style>
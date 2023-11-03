<template>
  <!-- <h3>Text</h3> -->
  <div class="win_text bible-text in_body scrollable">
    <text-verse
      v-for="vrs in verses"
      :key="vrs.part_id"
      :verse="vrs"
    ></text-verse>
  </div>
</template>

<script setup>
import TextVerse from "./TextVerse.vue";
import { inject, ref, watch } from "vue";
import { sendToServer } from "../../server.js";

const elementId = inject("elementId");
const hasToReload = inject("hasToReload");
const reloaded = inject("reloaded");

const verses = ref([]);

watch(hasToReload, function (newVal) {
  if (newVal) {
    loadElmText();
    reloaded();
  }
});

loadElmText();

async function loadElmText() {
  const data = {
    type: "element",
    oper: "get_segment",
    id: elementId.value,
    prop: { dummy: "" },
  };

  const obj = await sendToServer(data);

  verses.value = obj.data.part_list;
}
</script>

<style scoped>
.win_text {
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 15px;
  border: 1px solid #9aaab9;
  background-color: white;
  text-align: justify;
}

.bible-text {
  font-family: David, sans-serif;
}

.in_body {
  margin: 15px auto;
}
</style>

<template>
  <base-scrollable class="bible-text">
    <div>
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
import { inject, ref } from "vue";
import { sendToServer } from "../../server.js";

const elementId = inject("elementId");

const verses = ref([]);

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

defineExpose({ reload: loadElmText });
</script>

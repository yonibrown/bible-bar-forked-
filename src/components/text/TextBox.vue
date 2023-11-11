<template>
  <sequence-menu
    v-show="displayOptions"
    :elementAttr="elementAttr"
    :displayScale="false"
    :enableWholeText="false"
  ></sequence-menu>
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
import SequenceMenu from "../sequence/SequenceMenu.vue";
import TextVerse from "./TextVerse.vue";
import { inject, ref } from "vue";
import { sendToServer } from "../../server.js";

const props = defineProps(["elementAttr"]);
const displayOptions = inject("displayOptions");
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

<template>
  <spec-line @dblclick="openText">
    <template #col>
      <span>{{ collection.name }}</span>
    </template>
    <template #src>
      <span>{{ line.src_name.replaceAll(",", " ") }}</span>
    </template>
    <template #text>
      <span class="bible-text">
        {{ line.text_before }}<b> {{ line.text_part }}</b>
        {{ line.text_after }}
      </span>
    </template>
  </spec-line>
</template>

<script setup>
import SpecLine from "../ui/SpecLine.vue";
import { inject, computed } from "vue";
const props = defineProps(["line", "field"]);

const researchObjId = inject("researchObjId");
const resMethods = inject("resMethods");
const collection = computed(function () {
  return resMethods.getCollection(researchObjId.res, props.line.col);
});

const partOpenText = inject("openText");
function openText() {
  partOpenText({
    type: "text",
    point_research_id: researchObjId.res,
    point_part_id: props.line.id,
  });
}
</script>

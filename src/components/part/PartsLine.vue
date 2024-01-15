<template>
  <spec-line>
    <template #col>
      <span>{{ collection.name }}</span>
    </template>
    <template #src>
      <span @dblclick="openText">{{ line.src_name.replaceAll(",", " ") }}</span>
    </template>
    <template #text>
      <span class="bible-text" @dblclick="openText">
        {{ line.text_before }}<b> {{ line.text_part }}</b>
        {{ line.text_after }}
      </span>
    </template>
    <template #from_div>
      <span>{{ line.src_name.replaceAll(",", " ") }}</span>
    </template>
    <template #from_text>
      <span>{{ line.src_from_text }}</span>
    </template>
    <template #to_div>
      <span>{{ line.src_to_name.replaceAll(",", " ") }}</span>
    </template>
    <template #to_text>
      <span>{{ line.src_to_text }}</span>
    </template>
  </spec-line>
</template>

<script setup>
import SpecLine from "../ui/SpecLine.vue";
import { inject, computed } from "vue";

const props = defineProps(["line", "field"]);
console.log('line',props.line);

const researchObjId = inject("researchObjId");
const research = inject("research");
const collection = computed(function () {
  return research.value.getCollection(props.line.col);
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

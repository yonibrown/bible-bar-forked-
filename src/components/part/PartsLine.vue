<template>
  <spec-line>
    <template #col>
      <span>{{ collection.name }}</span>
    </template>
    <template #src>
      <verse-range
        :part="line"
        :editable="enableSelection"
        @changeValue="(newVal) => updateRange(line, newVal)"
        :referenceStyle="0"
        ></verse-range>
    </template>
    <template #text>
      <text-range
        :part="line"
        :editMode="enableSelection"
        @changeValue="(newVal) => updateRange(line, newVal)"
        :displayWholeVerse="true"
      ></text-range>
    </template>
  </spec-line>
</template>

<script setup>
import VerseRange from "../sequence/VerseRange.vue";
import TextRange from "../ui/TextRange/TextRange.vue";
import { inject, computed } from "vue";

const props = defineProps(["line"]);
const enableSelection = inject("enableSelection");

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

function updateRange(part, newVal) {
  part.changeAttr(newVal);
}
</script>

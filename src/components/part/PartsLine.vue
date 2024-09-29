<template>
  <spec-line>
    <template #col>
      <span>{{ collection.name }}</span>
    </template>
    <template #src>
      <verse-range
        :part="line"
        @changeValue="(newVal) => updateRange(line, newVal)"
      ></verse-range>
    </template>
    <template #text>
      <text-range
        :fromPosition="line.src_from_position"
        :fromText="line.src_from_text"
        :fromWord="line.src_from_word"
        :toPosition="line.src_to_position"
        :toText="line.src_to_text"
        :toWord="line.src_to_word"
        :disabled="!enableSelection"
        @changeValue="(newVal) => updateRange(line, newVal)"
      ></text-range>
    </template>
  </spec-line>
</template>

<script setup>
import SpecLine from "../ui/SpecLine.vue";
import VerseRange from "../sequence/VerseRange.vue";
import TextRange from "../ui/TextRange.vue";
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

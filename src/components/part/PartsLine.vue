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
    <template #div_range>
      <verse-range
        :part="line"
        @changeValue="(newVal) => updateRange(line, newVal)"
      ></verse-range>
    </template>
    <template #text_range>
      <!-- <span>{{ textRange }}</span> -->
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
    <!-- <template #to_div>
      <verse-editable
      :initial-value="line.src_name.replaceAll(',', ' ')"
      placeholder="פסוק"
      :seqIndex="seqIndex"
      :initPosition="line.src_from_position"
      ></verse-editable>
      <span>{{ line.src_to_name.replaceAll(",", " ") }}</span>
    </template>
    <template #to_text>
      <span>{{ line.src_to_text }}</span>
    </template> -->
  </spec-line>
</template>

<script setup>
import SpecLine from "../ui/SpecLine.vue";
import VerseRange from "../sequence/VerseRange.vue";
import TextRange from "../ui/TextRange.vue";
import { inject, computed, provide } from "vue";

const props = defineProps(["line", "field"]);
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

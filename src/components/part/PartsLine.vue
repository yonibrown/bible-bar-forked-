<template>
  <spec-line>
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
const getCollection = inject("getCollection");
const collection = computed(function () {
  return getCollection(researchObjId.res, props.line.col);
});
</script>

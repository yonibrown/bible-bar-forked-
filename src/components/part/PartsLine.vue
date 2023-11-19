<template>
  <span v-if="field.name == 'col'">{{ collection.name }}</span>
  <span v-else-if="field.name == 'src'">{{
    line.src_name.replaceAll(",", " ")
  }}</span>
  <span v-else class="bible-text">
    {{ line.text_before }}<b> {{ line.text_part }}</b>
    {{ line.text_after }}
  </span>
</template>

<script setup>
import { inject } from "vue";
const props = defineProps(["line", "field"]);

const researchId = inject("researchId");
const getCollection = inject("getCollection");
const collection = getCollection(researchId.res, props.line.col);
</script>

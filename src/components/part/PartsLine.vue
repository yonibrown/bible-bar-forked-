<template>
  <span v-if="field.name == 'col'">{{ colName }}</span>
  <span v-else-if="field.name == 'src'">{{
    line.src_name.replaceAll(",", " ")
  }}</span>
  <span v-else class="bible-text">
    {{ line.text_before }}<b> {{ line.text_part }}</b>
    {{ line.text_after }}
  </span>
</template>

<script setup>
import { computed } from "@vue/reactivity";
import { ref, inject ,provide} from "vue";
const props = defineProps(["line", "field"]);

const researchId = inject("researchId");
const getCollection = inject('getCollection');
// const collection = getCollection(researchId.res,props.line.col);
const colName = computed(function(){
  return  getCollection(researchId.res,props.line.col).name;
});
</script>

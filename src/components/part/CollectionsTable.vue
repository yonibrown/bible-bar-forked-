<template>
  <spec-table
    :enableSelection="displayOptions"
    :tableFields="tableFields"
    :lines="research.collections"
    lineComponent="collection-line"
    ref="tableRef"
    :enableNewLine="true"
  >
  </spec-table>
</template>

<script setup>
import SpecTable from "../ui/SpecTable.vue";
import { inject, ref } from "vue";

const displayOptions = inject("displayOptions");
const research = inject("research");
const tableRef = ref([]);

// table properties
const tableFields = [
  {
    name: "name",
    title: "קטגוריה",
    sortable: false,
    fit: true,
    display: true
  },
  {
    name: "description",
    title: "הערות",
    sortable: false,
    fit: false,
    display: true
  },
];

function removeSelected() {
  research.value.deleteCollections( tableRef.value.selectedLines);
}

defineExpose({ removeSelected });
</script>

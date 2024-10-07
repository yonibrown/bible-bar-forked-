<template>
  <spec-table
    :enableSelection="editMode"
    :tableFields="tableFields"
    :lines="research.collections"
    lineComponent="collection-line"
    ref="tableRef"
    :enableNewLine="true"
  >
  </spec-table>
</template>

<script setup>
import { inject, ref } from "vue";

const editMode = inject("editMode");
const research = inject("research");
const tableRef = ref([]);

// table properties
const tableFields = [
  {
    id: 0,
    type: "name",
    title: "קטגוריה",
    sortable: false,
    display: true,
  },
  {
    id: 1,
    type: "description",
    title: "הערות",
    sortable: false,
    display: true,
  },
];

function removeSelected() {
  research.value.deleteCollections(tableRef.value.selectedLines);
}

defineExpose({ removeSelected });
</script>

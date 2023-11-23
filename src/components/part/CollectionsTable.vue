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
import { inject } from "vue";

const displayOptions = inject("displayOptions");
const research = inject("research");

// table properties
const tableFields = [
  {
    name: "name",
    title: "קטגוריה",
    sortable: false,
    fit: true,
  },
  {
    name: "description",
    title: "הערות",
    sortable: false,
    fit: false,
  },
];
</script>

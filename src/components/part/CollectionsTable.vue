<template>
  <base-table
    :enableSelection="displayOptions"
    :tableFields="tableFields"
    :lines="research.collections"
    lineComponent="collection-line"
    ref="tableRef"
    :enableNewLine="true"
  >
  </base-table>
</template>

<script setup>
import BaseTable from "../ui/BaseTable.vue";
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

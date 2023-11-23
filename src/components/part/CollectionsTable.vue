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
import { sendToServer } from "../../server.js";

const displayOptions = inject("displayOptions");
const research = inject("research");
const researchId = inject("researchId");
const tableRef = ref([]);

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

async function removeSelected() {
  const data = {
    type: "research",
    oper: "delete_collections",
    id: researchId,
    prop: {
      colList: tableRef.value.selectedLines,
    },
  };

  console.log(data);
  const obj = await sendToServer(data);
}

defineExpose({ removeSelected });
</script>

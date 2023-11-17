<template>
  <base-table
    :enableSelection="displayOptions"
    :tableFields="tableFields"
    :lines="collections"
    lineComponent="collection-line"
    ref="tableRef"
  >
  </base-table>
</template>

<script setup>
import BaseTable from "../ui/BaseTable.vue";
import { computed, ref, inject } from "vue";
import { sendToServer } from "../../server.js";

const displayOptions = inject("displayOptions");
const elementAttr = inject("elementAttr");

const researchId = { res: elementAttr.value.res };

const collections = ref([]);

// load data
loadResearchCollections();

async function loadResearchCollections() {
  const data = {
    type: "research",
    oper: "get_col_list",
    id: researchId,
    prop: { dummy: "" },
  };

  const obj = await sendToServer(data);
  collections.value = obj.data;
}

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

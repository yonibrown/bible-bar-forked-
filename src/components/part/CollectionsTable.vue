<template>
  <div>
    <base-scrollable>
      <base-table
        :enableSelection="displayOptions"
        :tableFields="tableFields"
      >
        <collection-line
          ref="linesRef"
          v-for="col in filteredCollections"
          :col="col"
          :key="col.id"
          :checkAll="checkAllRef"
        ></collection-line>
      </base-table>
    </base-scrollable>
    <span v-show="displayOptions">
      <span>בחר הכל:</span>
      <input
        type="checkbox"
        v-model="checkAllRef"
        :indeterminate="checkPartial"
      />
    </span>
  </div>
</template>

<script setup>
import BaseTable from "../ui/BaseTable.vue";
import CollectionLine from "./CollectionLine.vue";
import { computed, ref, inject, watch } from "vue";
import { sendToServer } from "../../server.js";
const displayOptions = inject("displayOptions");

// table properties
const tableFields = [
  {
    name: "name",
    title: "קטגוריה",
    sortable: false,
  },
  {
    name: "description",
    title: "הערות",
    sortable: false,
  },
];

</script>

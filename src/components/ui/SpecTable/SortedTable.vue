<template>
  <spec-table
    :enableSelection="enableSelection"
    :tableFields="tableFields"
    :sortField="sortField"
    @changeSortField="
      (x) => {
        $emit('changeSortField', x);
      }
    "
    @resizeField="
      (x) => {
        $emit('resizeField', x);
      }
    "
    :ascending="ascending"
    @reverseTable="
      (x) => {
        $emit('reverseTable', x);
      }
    "
    :lines="sortedLines"
    :lineComponent="lineComponent"
  >
  </spec-table>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps([
  "enableSelection",
  "tableFields",
  "sortField",
  "ascending",
  "lines",
  "lineComponent",
  "enableNewLine",
  "hilightTable",
  "reorderFields",
]);
const emit = defineEmits([
  "reverseTable",
  "changeSortField",
  "resizeField",
  "reorderFields",
]);

const sortedLines = computed(function () {
  if (!props.lines) {
    return [];
  }
  const arr = props.lines.slice();
  //   console.log("arr", arr);
  arr.sort(function (a, b) {
    return props.ascending &&
      a.sort_key[props.sortField] > b.sort_key[props.sortField]
      ? 1
      : -1;
  });
  return arr;
});
</script>

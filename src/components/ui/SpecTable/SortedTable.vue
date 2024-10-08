<template>
  <spec-table
    :enableSelection="enableSelection"
    :tableFields="tableFields"
    :sortField="sortField"
    :ascending="ascending"
    :lines="sortedLines"
    :lineComponent="lineComponent"
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
    @reverseTable="
      (x) => {
        $emit('reverseTable', x);
      }
    "
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

const newLineArray = [{ newLine: true }];

const sortedLines = computed(function () {
  if (!props.lines) {
    return [];
  }
  const arr = props.lines.slice();
  //   console.log("arr", arr);
  arr.sort(function (a, b) {
    return (props.ascending &&
      a.sort_key[props.sortField] > b.sort_key[props.sortField]) ||
      (!props.ascending &&
        a.sort_key[props.sortField] < b.sort_key[props.sortField])
      ? 1
      : -1;
  });
  if (props.enableNewLine && props.enableSelection) {
    return arr.concat(newLineArray);
  }
  return arr;
});
</script>

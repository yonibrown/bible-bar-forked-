<template>
  <div @mouseleave="leaveTable">
    <base-scrollable :hilightDiv="hilightTable">
      <table ref="table">
        <spec-header></spec-header>
        <spec-line-wrapper
          v-for="(line, idx) in lineList"
          ref="linesRef"
          :line="line"
          :key="line.id"
          :lineComponent="lineComponent"
          :checkAll="checkAllRef"
          @mouseover="enterTr(idx)"
        ></spec-line-wrapper>
      </table>
    </base-scrollable>
    <span v-show="enableSelection">
      <input
        type="checkbox"
        v-model="checkAllRef"
        :indeterminate="checkPartial"
      />
      <span>בחר הכל</span>
    </span>
    <row-menu
      :offset="chosenTrOffset"
      v-show="enableSelection && chosenTrOffset > 0"
    ></row-menu>
  </div>
</template>

<script setup>
import SpecHeader from "./internal/SpecHeader.vue";
import SpecLineWrapper from "./internal/SpecLineWrapper.vue";
import RowMenu from "./internal/RowMenu.vue";
import { computed, ref, watch, provide } from "vue";
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

provide("tableProps", props);
provide("tableEmit", emit);

provide(
  "tableFields",
  computed(function () {
    return props.tableFields;
  })
);

provide(
  "enableSelection",
  computed(function () {
    return props.enableSelection;
  })
);

const linesRef = ref([]);
const table = ref();

const newLineArray = [{ newLine: true }];
const lineList = computed(function () {
  if (props.enableNewLine && props.enableSelection) {
    return props.lines.concat(newLineArray);
  }
  return props.lines;
});

const inactiveLines = props.enableNewLine ? 1 : 0;

const checkAllRef = ref(false);

const checkPartial = ref(false);

const selectedLines = computed(function () {
  return linesRef.value
    .filter(function (line) {
      return line.checked;
    })
    .map(function (line) {
      return line.id;
    });
});

const checkState = computed(function () {
  const len = selectedLines.value.length;
  if (len == 0) {
    return "none";
  }
  if (len == linesRef.value.length - inactiveLines) {
    return "all";
  }
  return "partial";
});

watch(checkState, function (newVal) {
  if (newVal == "all") {
    checkAllRef.value = true;
    checkPartial.value = false;
  } else {
    if (newVal == "none") {
      checkAllRef.value = false;
      checkPartial.value = false;
    } else {
      checkPartial.value = true;
    }
  }
});

const chosenTrOffset = ref(-1);
function enterTr(idx) {
  chosenTrOffset.value =
    linesRef.value[idx].tr.offsetTop + table.value.offsetTop;
}
function leaveTable() {
  chosenTrOffset.value = -1;
}

defineExpose({ selectedLines });
</script>

<style scoped>
table {
  background-color: #e4e4e4;
  text-align: justify;
  width: 100%;
  /* max-width: 85%; */
}
</style>

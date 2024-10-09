<template>
  <div @mouseleave="leaveTable">
    <base-scrollable :hilightDiv="hilightTable">
      <table ref="table">
        <spec-header @mouseover="enterTr(-1)" ref="header"></spec-header>
        <spec-line-wrapper
          v-for="(line, idx) in sortedLines"
          ref="linesRef"
          :line="line"
          :key="idx"
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
      v-show="enableSelection && chosenTrIdx > -2"
      :offset="chosenTrOffset"
      :lineIdx="chosenTrIdx"
      @openNewLine="openNewLine"
      @deleteLine="deleteLine"
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
  "storeLineWhenAdded",
]);
const emit = defineEmits([
  "reverseTable",
  "changeSortField",
  "resizeField",
  "reorderFields",
  "addLine",
]);

provide("tableProps", props);
provide("tableEmit", emit);

provide(
  "tableFields",
  computed(function () {
    return props.tableFields;
  }),
);

provide(
  "enableSelection",
  computed(function () {
    return props.enableSelection;
  }),
);

const linesRef = ref([]);
const table = ref();
const header = ref();

const newLinePosition = ref(0);
const newLine = computed(function () {
  return [];
});
const lineList = computed(function () {
  return props.lines;
});
const sortedLines = computed(function () {
  if (!lineList.value) {
    return [];
  }

  // create array
  // const arr = lineList.value.slice();
  const arr = lineList.value.filter(function (line) {
    return line.position > 0;
  });

  // add new line
  if (newLinePosition.value > 0) {
    arr.push({ newLine: true, position: newLinePosition.value });
  }

  // sort
  arr.sort(function (a, b) {
    // if there is no sort field
    if (props.sortField == -1) {
      return a.position > b.position ? 1 : -1;
    }

    // if there is an attribute 'sort_key'
    if (a.sort_key) {
      return (props.ascending &&
        a.sort_key[props.sortField] > b.sort_key[props.sortField]) ||
        (!props.ascending &&
          a.sort_key[props.sortField] < b.sort_key[props.sortField])
        ? 1
        : -1;
    }

    // if there is a method 'sortKey'
    if (a.sortKey) {
      console.log("sortKey", a.sortKey(props.sortField));
      return (props.ascending &&
        a.sortKey(props.sortField) > b.sortKey(props.sortField)) ||
        (!props.ascending &&
          a.sortKey(props.sortField) < b.sortKey(props.sortField))
        ? 1
        : -1;
    }
    return 1;
  });

  // add constant new line in the end of the list
  if (props.enableNewLine && props.enableSelection) {
    arr.push({ newLine: true });
  }
  return arr;
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
const chosenTrIdx = ref(-2);
function enterTr(idx) {
  let trRef = null;
  if (idx == -1) {
    trRef = header.value;
  } else {
    trRef = linesRef.value[idx];
  }
  chosenTrOffset.value = table.value.offsetTop + trRef.tr.offsetTop;
  chosenTrIdx.value = idx;
}
function leaveTable() {
  chosenTrOffset.value = -1;
  chosenTrIdx.value = -2;
}

function openNewLine() {
  let afterPosition = 0;
  if (chosenTrIdx.value >= 0) {
    afterPosition = sortedLines.value[chosenTrIdx.value].position;
  }

  let newPosition = afterPosition;
  if (chosenTrIdx.value == sortedLines.value.length - 1) {
    newPosition += 1;
  } else {
    let gap = sortedLines.value[chosenTrIdx.value + 1].position - afterPosition;
    newPosition += 0.5 * gap;
  }

  if (props.storeLineWhenAdded) {
    emit("addLine", { position: newPosition });
  } else {
    newLinePosition.value = newPosition;
  }
}

function deleteLine() {
  emit("deleteLine", sortedLines.value[chosenTrIdx.value]);
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

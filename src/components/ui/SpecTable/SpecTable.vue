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
      v-show="enableSelection && focusTrIdx > -2"
      :offset="focusTrOffset"
      :lineIdx="focusTrIdx"
      @openNewLine="openNewLine"
      @deleteLine="deleteLine"
      @moveup="moveLine(-1)"
      @movedown="moveLine(1)"
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
  "randomSortAvailable",
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
  "reorderFields",
  "addLine",
  "deleteLine",
  "reorderLines",
  "sortLines",
  "changeField",
  "openFieldMenu",
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

provide(
  "linesLength",
  computed(function () {
    return linesRef.value.length;
  })
);

const linesRef = ref([]);
const table = ref();
const header = ref();

const newLinePosition = ref(0);
const sortedLines = computed(function () {
  if (!props.lines) {
    return [];
  }

  // create array
  // const arr = props.lines.slice();
  const arr = props.lines.filter(function (line) {
    return line.position > 0 || typeof line.position == "undefined";
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

const focusTrOffset = ref(-1);
const focusTrIdx = ref(-2);
function enterTr(idx) {
  let trRef = null;
  if (idx == -1) {
    trRef = header.value;
  } else {
    trRef = linesRef.value[idx];
  }
  focusTrOffset.value = table.value.offsetTop + trRef.tr.offsetTop;
  focusTrIdx.value = idx;
}
function leaveTable() {
  focusTrOffset.value = -1;
  focusTrIdx.value = -2;
}

const focusLine = computed(function () {
  return sortedLines.value[focusTrIdx.value];
});
// const focusNextLine = computed(function () {
//   return sortedLines.value[focusTrIdx.value + 1];
// });
// const focusPosition = computed(function () {
//   return focusLine.value.position;
// });
// const focusNextPosition = computed(function () {
//   return focusNextLine.value.position;
// });

function openNewLine() {
  if (props.storeLineWhenAdded) {
    emit("addLine", { idx: focusTrIdx.value + 1 });
    // emit("addLine", { position: newPosition });
    // } else {
    //   let afterPosition = 0;
    //   if (focusTrIdx.value >= 0) {
    //     afterPosition = focusPosition.value;
    //   }

    //   let newPosition = afterPosition;
    //   if (focusTrIdx.value == sortedLines.value.length - 1) {
    //     newPosition += 1;
    //   } else {
    //     let gap = focusNextPosition.value - afterPosition;
    //     newPosition += 0.5 * gap;
    //   }

    //   newLinePosition.value = newPosition;
  }
}

function deleteLine() {
  emit("deleteLine", focusLine.value);
}

function moveLine(steps) {
  emit("reorderLines", { sourceIdx: focusTrIdx.value, steps });
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

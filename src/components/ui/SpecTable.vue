<template>
  <div>
    <base-scrollable>
      <table>
        <tr class="header">
          <td v-show="enableSelection" class="fit-column"></td>
          <td v-for="fld in tableFields" :class="{ 'fit-column': fld.fit }">
            <span
              v-if="fld.sortable"
              @dblclick="changeSort(fld.name)"
              :class="{ sortingField: sortField == fld.name }"
            >
              {{ fld.title }}
              <i
                v-show="sortField == fld.name"
                class="fa"
                :class="ascending ? 'fa-arrow-up' : 'fa-arrow-down'"
              ></i>
            </span>
            <span v-else>{{ fld.title }}</span>
          </td>
        </tr>
        <spec-line-wrapper
          ref="linesRef"
          v-for="line in lineList"
          :line="line"
          :key="line.id"
          :lineComponent="lineComponent"
          :checkAll="checkAllRef"
        ></spec-line-wrapper>
      </table>
    </base-scrollable>
    <span v-show="enableSelection">
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
import SpecLineWrapper from "./SpecLineWrapper.vue";
import { computed, ref, watch, provide } from "vue";
const props = defineProps([
  "enableSelection",
  "tableFields",
  "sortField",
  "ascending",
  "lines",
  "lineComponent",
  "enableNewLine",
]);
const emit = defineEmits(["reverseTable", "changeSortField"]);
provide("tableFields", props.tableFields);
const enableLineEdit = computed(function () {
  return props.enableSelection;
});

provide("enableSelection", enableLineEdit);

const linesRef = ref([]);

const newLineArray = [
  {
    newLine: true,
  },
];
const lineList = computed(function () {
  if (props.enableNewLine && props.enableSelection) {
    return props.lines.concat(newLineArray);
  }
  return props.lines;
});

const inactiveLines = props.enableNewLine ? 1 : 0;

function changeSort(newField) {
  if (props.sortField == newField) {
    emit("reverseTable");
  } else {
    emit("changeSortField", newField);
  }
}

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
  if (len == (linesRef.value.length - inactiveLines)) {
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

defineExpose({ selectedLines });
</script>

<style scoped>
.header {
  background-color: #ebebeb;
  user-select: none;
}

.header td {
  background-color: #ebebeb;
  padding: 2px 0 5px 0;
  /* border-bottom: 2px solid #e9e9e9; */
  font-size: 70%;
  position: sticky;
  top: 0;
  /* cursor: pointer; */
}

table {
  background-color: #e9e9e9;
  text-align: justify;
  width: 100%;
  /* max-width: 85%; */
}

.sortingField {
  font-weight: bold;
}
.fit-column {
  width: 1px;
}
</style>

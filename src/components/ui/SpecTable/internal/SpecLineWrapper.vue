<template>
  <tr class="table-line" ref="row">
    <td v-show="enableSelection">
      <input type="checkbox" v-model="checked" v-if="!line.newLine" />
    </td>
    <component :is="lineComponent" ref="linesRef" :line="line"></component>
  </tr>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
const props = defineProps(["line", "lineComponent", "checkAll"]);
const enableSelection = inject("enableSelection");

const checked = ref(false);
const row = ref();

const checkAll = computed(function () {
  return props.checkAll;
});
if (!props.line.newLine) {
  watch(checkAll, function (newVal) {
    if (checked.value != newVal) {
      checked.value = newVal;
    }
  });
}

const lineId = computed(function () {
  if (props.line.newLine) {
    return null;
  }
  return props.line.id;
});

defineExpose({
  id: lineId,
  checked,
  tr: row,
});
</script>

<style scoped>
.table-line {
  background-color: white;
}

td {
  font-size: 85%;
}

/* .fit-column {
  width: 1px;
  white-space: nowrap;
} */
</style>

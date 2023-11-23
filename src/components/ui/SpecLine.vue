<template>
  <tr class="table-line">
    <td v-show="enableSelection" class="fit-column">
      <input type="checkbox" v-model="checked" />
    </td>
    <td v-for="fld in tableFields" :class="{ 'fit-column': fld.fit }">
      <slot :name="fld.name"></slot>
    </td>
  </tr>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
const props = defineProps(["line"]);

const checkAll = inject("checkAll");
const enableSelection = inject("enableSelection");
const tableFields = inject("tableFields");
const checked = ref(false);

const lineId = computed(function () {
  if (props.line.newLine) {
    return null;
  }
  return props.line.id;
});

defineExpose({
  id: lineId,
  checked,
});

watch(checkAll, function (newVal) {
  checked.value = newVal;
});
</script>

<style scoped>
td {
  font-size: 85%;
}

.table-line {
  background-color: white;
}

.fit-column {
  width: 1px;
  white-space: nowrap;
}
</style>

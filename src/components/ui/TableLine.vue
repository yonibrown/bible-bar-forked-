<template>
  <tr class="table-line">
    <td v-show="enableSelection">
      <input type="checkbox" v-model="checked" />
    </td>
    <td v-for="fld in tableFields">
      <component :is="lineComponent" :line="line" :field="fld"></component>
    </td>
  </tr>
</template>

<script setup>
import { ref,  computed, watch } from "vue";
const props = defineProps([
  "line",
  "checkAll",
  "enableSelection",
  "tableFields",
  "lineComponent"
]);

const checked = ref(false);
defineExpose({
  id: props.line.id,
  checked,
});

const checkAll = computed(function () {
  return props.checkAll;
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
</style>

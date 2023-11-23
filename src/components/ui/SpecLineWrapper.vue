<template>
  <component :is="lineComponent" ref="linesRef" :line="line"></component>
</template>

<script setup>
import { ref, computed, watch, inject, provide } from "vue";
const props = defineProps(["line", "lineComponent"]);

const checked = ref(false);
provide("checked", checked);

const checkAll = inject("checkAll");
if (!props.line.newLine) {
  watch(checkAll, function (newVal) {
    checked.value = newVal;
  });
}

function changeSelection(newVal) {
  checked.value = newVal;
}
provide("changeSelection", changeSelection);

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
</script>

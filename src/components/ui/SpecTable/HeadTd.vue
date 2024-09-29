<template>
  <div :class="{ editHeader: enableSelection }" ref="cell">
    <slot></slot>
  </div>
</template>

<script setup>
import { inject, ref, watch, computed } from "vue";

const enableSelection = inject("enableSelection");
const emit = defineEmits(["resize"]);

const cell = ref();
const width = computed(function () {
  if (cell.value) {
    return cell.value.style.width;
  }
  return 0;
});
defineExpose({ width });

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // check if the mutation is attributes and update the width and height data if it is.
    if (mutation.type === "attributes" && cell.value.style.width != '') {
      emit("resize", { width: cell.value.style.width });
    }
  });
});

watch(enableSelection, function (newVal) {
  if (newVal) {
    // observe element's specified mutations
    observer.observe(cell.value, { attributes: true });
  } else {
    observer.disconnect();
  }
});
</script>

<style scoped>
.editHeader {
  resize: horizontal;
  overflow: auto;
}
</style>

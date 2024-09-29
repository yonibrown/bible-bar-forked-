<template>
  <div
    :class="{ editHeader: enableSelection && widthPct }"
    ref="cell"
    :style="{ width: width + 'px' }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch } from "vue";

const enableSelection = inject("enableSelection");
const rowWidth = inject("rowWidth");
const emit = defineEmits(["resize"]);
const props = defineProps(["widthPct"]);

const cell = ref();
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // check if the mutation is attributes and update the width and height data if it is.
    if (mutation.type === "attributes" && cell.value.style.width != "") {
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

const width = computed(function () {
  if (rowWidth.value) {
    return (props.widthPct * rowWidth.value) / 100;
  } else {
    return 1;
  }
});
</script>

<style scoped>
.editHeader {
  resize: horizontal;
  overflow: auto;
  min-width: 100%;
}
</style>

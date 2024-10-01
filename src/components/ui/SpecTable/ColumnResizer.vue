<template>
  <div :class="{ lastFieldWrapper: lastField }">
    <div
      :class="{ resizerActive: enableSelection && !lastField }"
      ref="resizer"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch } from "vue";

const enableSelection = inject("enableSelection");
const tableEmit = inject("tableEmit");
const rowWidth = inject("rowWidth");
const props = defineProps(["fld", "fldidx", "lastField"]);

const resizer = ref();
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // check if the mutation is attributes and update the width and height data if it is.
    if (mutation.type === "attributes" && resizer.value.style.width != "") {
      let resizerWidth = parseInt(
        document.defaultView.getComputedStyle(resizer.value).width,
        10
      );

      let resizerWidthPct = (resizerWidth / rowWidth.value) * 100;

      resizeField({ width: Math.min(resizerWidthPct, 100) });
    }
  });
});

var resizeTimeout = null;
var resizeData = {};
function resizeField(style) {
  resizeData = { fieldIndex: props.fldidx, width: style.width };
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    tableEmit("resizeField", resizeData);
  }, 1000);
}

watch(enableSelection, function (newVal) {
  if (newVal) {
    // observe element's specified mutations
    observer.observe(resizer.value, { attributes: true });
  } else {
    observer.disconnect();
  }
});

const width = computed(function () {
  if (rowWidth.value) {
    return (props.fld.widthPct * rowWidth.value) / 100;
  } else {
    return 1;
  }
});

watch(rowWidth, function () {
  if (!props.lastField) {
    resizer.value.style.width = width.value + "px";
  }
});
</script>

<style scoped>
.resizerActive {
  resize: horizontal;
  overflow: auto;
  min-width: 100%;
}
.lastFieldWrapper {
  width: 100vw;
}
</style>

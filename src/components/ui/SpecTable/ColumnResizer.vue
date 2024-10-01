<template>
  <div
    :class="{ resizeActive: enableSelection && !lastField, lastField }"
    ref="resizer"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch } from "vue";

const enableSelection = inject("enableSelection");
const tableEmit = inject('tableEmit');
const rowWidth = inject("rowWidth");
const props = defineProps(["fld", "fldidx","lastField"]);

const resizer = ref();
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // check if the mutation is attributes and update the width and height data if it is.
    if (mutation.type === "attributes" && resizer.value.style.width != "") {
      resizeCell( {
        width: Math.min(
          (parseInt(
            document.defaultView.getComputedStyle(resizer.value).width,
            10
          ) /
            rowWidth.value) *
            100,
          100
        ),
      });
    }
  });
});

var resizeTimeout = null;
var resizeData = {};
function resizeCell(style) {
  resizeData = { fieldIndex:props.fldidx, width: style.width };
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
.resizeActive {
  resize: horizontal;
  overflow: auto;
  min-width: 100%;
}
.lastField {
  width: 100vw;
}
</style>

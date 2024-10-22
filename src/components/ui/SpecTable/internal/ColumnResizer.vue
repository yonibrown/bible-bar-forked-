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
import { computed, inject, onMounted, ref, watch } from "vue";

const enableSelection = inject("enableSelection");
const tableEmit = inject("tableEmit");
const rowWidth = inject("rowWidth");
const props = defineProps(["fld", "lastField"]);

var initialWidth = 1.0;
var structChanged = false;
var structRatio = 1.0;

const resizer = ref();
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // check if the mutation is attributes and update the width and height data if it is.
    if (mutation.type === "attributes" && resizer.value.style.width != "") {
      let resizerWidth = parseFloat(
        document.defaultView.getComputedStyle(resizer.value).width
      );

      if (structChanged) {
        structRatio = initialWidth / resizerWidth;
        initialWidth = resizerWidth;
        structChanged = false;
      } else {
        let resizerWidthPct =
          ((resizerWidth * structRatio) / rowWidth.value) * 100;
        resizeField({ width: Math.min(resizerWidthPct, 100) });
      }
    }
  });
});

var resizeTimeout = null;
var resizeData = {};
function resizeField(style) {
  resizeData = { id: props.fld.id, attr: { width_pct: style.width } };
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    tableEmit("changeField", resizeData);
  }, 1000);
}

watch(enableSelection, function (newVal) {
  if (newVal) {
    structChanged = true;
    // observe element's specified mutations
    observer.observe(resizer.value, { attributes: true });
  } else {
    observer.disconnect();
  }
});

const width = computed(function () {
  if (rowWidth.value) {
    return Math.max((props.fld.widthPct * rowWidth.value) / 100, 1.0);
  } else {
    return 1.0;
  }
});

function setSize() {
  if (!props.lastField) {
    resizer.value.style.width = width.value + "px";
    initialWidth = width.value;
  }
}

watch(rowWidth, setSize);
onMounted(setSize);
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

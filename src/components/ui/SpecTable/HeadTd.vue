<template>
  <td v-show="fld.display">
    <div
      :class="{ editHeader: enableSelection && !lastField, lastField }"
      ref="resizer"
    >
      <slot></slot>
    </div>
  </td>
</template>

<script setup>
import { computed, inject, ref, watch } from "vue";

const enableSelection = inject("enableSelection");
const rowWidth = inject("rowWidth");
const emit = defineEmits(["resize"]);
const props = defineProps(["fld", "lastField"]);

const resizer = ref();
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // check if the mutation is attributes and update the width and height data if it is.
    if (mutation.type === "attributes" && resizer.value.style.width != "") {
      //   emit("resize", { width: resizer.value.style.width });
      emit("resize", {
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
  resizer.value.style.width = width.value + "px";
});
</script>

<style scoped>
.editHeader {
  resize: horizontal;
  overflow: auto;
  min-width: 100%;
}
.lastField {
  width: 100vw;
}
</style>

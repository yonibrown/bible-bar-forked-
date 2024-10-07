<template>
  <tr class="table-line" @mouseover="enterTr" @mouseleave="leaveTr" ref="row">
    <td v-show="enableSelection">
      <input type="checkbox" v-model="checked" v-if="!line.newLine" />
    </td>
    <component :is="lineComponent" ref="linesRef" :line="line"></component>
    <div class="menu">תפריט שורה</div>
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

const hoverTr = ref(false);
function enterTr() {
  hoverTr.value = true;
  console.log("offsetTop", row.value.offsetTop);
}
function leaveTr() {
  hoverTr.value = false;
}

defineExpose({
  id: lineId,
  checked,
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

.menu {
  position: absolute;
  z-index: 1;
  /* bottom: 125%; */
  left: 50%;
  margin-left: -60px;
  border: solid;
}
</style>

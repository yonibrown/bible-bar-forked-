<template>
  <tr class="table-line">
    <td v-show="enableSelection" class="fit-column">
      <input type="checkbox" v-model="checked" v-if="!line.newLine" />
    </td>
    <td v-for="fld in tableFields" :class="{ 'fit-column': fld.fit }">
      <slot :name="fld.name"></slot>
    </td>
  </tr>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
const props = defineProps(["line"]);

const enableSelection = inject("enableSelection");
const tableFields = inject("tableFields");

const checked = ref(false);

const checkAll = inject("checkAll");
const changeSelection = inject("changeSelection");

if (!props.line.newLine) {
  watch(checkAll, function (newVal, oldVal) {
    console.log("iii", "watch checkAll " + oldVal + "=>" + newVal);
    if (checked.value != newVal) {
      checked.value = newVal;
    }
  });

  watch(checked, function (newVal, oldVal) {
    console.log("iii", "watch changeSelection " + oldVal + "=>" + newVal);
    if (newVal != oldVal) {
      changeSelection(newVal);
    }
  });
}

// const newLine = computed(function(){
//   if (props.line && props.line.newLine) {
//     return true;
//   }
//   return false;
// });
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

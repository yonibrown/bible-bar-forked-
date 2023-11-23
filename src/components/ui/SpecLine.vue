<template>
  <tr class="table-line">
    <td v-show="enableSelection" class="fit-column">
      <input type="checkbox" :checked="checked" @change="check" v-if="!line.newLine" />
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
function check(){
  console.log(checked.value);
  checked.value = true;
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

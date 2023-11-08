<template>
  <tr class="resprt-part">
    <td v-show="displayOptions"><input type="checkbox" v-model="checked" /></td>
    <td class="disp_view">{{ prt.col_name }}</td>
    <td>{{ prt.src_name.replaceAll(",", " ") }}</td>
    <td class="bible-text">
      {{ prt.text_before }}<b>{{ prt.text_part }}</b
      >{{ prt.text_after }}
    </td>
  </tr>
</template>

<script setup>
import { ref, inject,computed,watch } from "vue";
const props = defineProps(["prt","checkAll"]);

const displayOptions = inject("displayOptions");

const checked = ref(false);
defineExpose({
  id: props.prt.id,
  checked,
});

const checkAll = computed(function(){
  return props.checkAll;
});
watch(checkAll,function(newVal){
    checked.value = newVal;
});
// watch(checked,function(newVal){
//   if(!newVal && checkAll){
//     props.changeCheckAll(false);
//   }
// });
</script>

<style scoped>
td {
  font-size: 85%;
}

.resprt-part {
  background-color: white;
}
</style>

<template>
  <tr class="table-line">
    <td v-show="displayOptions"><input type="checkbox" v-model="checked" /></td>
    <td class="disp_view">{{ line.col_name }}</td>
    <td>{{ line.src_name.replaceAll(",", " ") }}</td>
    <td class="bible-text">
      {{ line.text_before }}<b>{{ line.text_part }}</b
      >{{ line.text_after }}
    </td>
  </tr>
</template>

<script setup>
import { ref, inject,computed,watch } from "vue";
const props = defineProps(["line","checkAll"]);

const displayOptions = inject("displayOptions");

const checked = ref(false);
defineExpose({
  id: props.line.id,
  checked,
});

const checkAll = computed(function(){
  return props.checkAll;
});
watch(checkAll,function(newVal){
    checked.value = newVal;
});
</script>

<style scoped>
td {
  font-size: 85%;
}

.table-line {
  background-color: white;
}
</style>

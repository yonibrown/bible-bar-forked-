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
import { ref, inject } from "vue";
const props = defineProps(["prt"]);

const displayOptions = inject("displayOptions");

const checked = ref(false);
defineExpose({
  id: props.prt.id,
  checked,
});
</script>

<style scoped>
td {
  font-size: 85%;
}

.resprt-part {
  background-color: white;
}
</style>

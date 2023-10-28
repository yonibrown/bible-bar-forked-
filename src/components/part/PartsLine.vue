<template>
    <tr class="resprt-part">
      <td class="disp_view">{{ prt.col_name }}</td>
      <td>{{ prt.src_name.replaceAll(',', ' ') }}</td>
      <td class="bible-text">
        {{ prt.text_before }}<b>{{ prt.text_part }}</b
        >{{ prt.text_after }}
      </td>
    </tr>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['prt']);
</script>

<style scoped>
td {
  font-size: 85%;
}

.bible-text {
  font-family: David, sans-serif;
}

.resprt-part {
  background-color: white;
}
</style>

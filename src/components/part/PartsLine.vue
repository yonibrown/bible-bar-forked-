<template>
  <span v-if="field.name == 'col'">{{ line.col_name }}</span>
  <span v-else-if="field.name == 'src'">{{
    line.src_name.replaceAll(",", " ")
  }}</span>
  <span v-else class="bible-text">
    {{ line.text_before }}<b> {{ line.text_part }}</b>
    {{ line.text_after }}
  </span>
</template>

<script setup>
const props = defineProps(["line", "field"]);
</script>

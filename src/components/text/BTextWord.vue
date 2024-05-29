<template>
  <span ref="wordObj">
    {{ word.word }}
  </span>
  <span class="text_space">
    {{ word.space }}
  </span>
</template>

<script setup>
const props = defineProps(["word"]);
</script>

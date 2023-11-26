<template>
  <span class="text-part" :res-position="verse.position" res-word="-0.5">
    {{ space }}
    <span class="text-title">{{ verse.part_name }}</span>
    {{ space }}
    <span class="text">
      <text-word v-for="wrd in verse.txt_list" :key="wrd.id" :word="wrd" :verse="verse">
      </text-word>
    </span>
  </span>
</template>

<script setup>
const props = defineProps(['verse']);
import TextWord from './TextWord.vue';
const space = ' ';
</script>

<style scoped>
.text-part {
  font-size: 155%;
}

.text-title {
  font-size: medium;
  color: #2243b2;
}
</style>

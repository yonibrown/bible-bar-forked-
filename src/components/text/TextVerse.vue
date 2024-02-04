<template>
  <span :res-position="verse.position" res-word="-0.5">
    <span>
      {{ space }}
      <span style="font-size: medium; color: #2243b2">{{
        verse.part_name
      }}</span>
      {{ space }}
    </span>
    <span class="text">
      <text-word
        v-for="wrd in verse.txt_list"
        :key="wrd.id"
        :word="wrd"
        :verse="verse"
      >
      </text-word>
    </span>
  </span>
</template>

<script setup>
const props = defineProps(["verse"]);
import TextWord from "./TextWord.vue";
const space = " ";
</script>

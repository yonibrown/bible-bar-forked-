<template>
  <span>
    <span>
      {{ space }}
      <span style="font-size: medium; color: #2243b2">{{
        verse.verse_heb
      }}</span>
      {{ space }}
    </span>
    <span class="text">
      <b-text-word
        v-for="wrd in verse.txt_list"
        :key="wrd.id"
        :word="wrd"
      >
      </b-text-word>
    </span>
  </span>
</template>

<script setup>
import BTextWord from "./BTextWord.vue";

const props = defineProps(['verse']);

const space = " ";
</script>

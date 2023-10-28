<template>
  <span :style="categoryStyle">{{ word.word }}</span>
  <span class="text_space">{{ word.space }}</span>
</template>

<script setup>
import { computed,inject } from 'vue';

const props = defineProps(['word', 'verse']);
const getCategory = inject('getCategory');

const categoryStyle = computed(() => {
  if (props.word.word_linked) {
    let cat = getCategory(props.word.link,props.word.col);
    if (cat && cat.display){
      return {
        backgroundColor: cat.color,
      };
    }
  }

  return {}; // no category linked
});
</script>

<style scoped></style>

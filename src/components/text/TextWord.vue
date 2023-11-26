<template>
  <span :style="categoryStyle" ref="wordObj" :res-word="word.id">{{ word.word }} </span>
  <span class="text_space" :res-word="0.5+word.id">{{ word.space }}</span>
</template>

<script setup>
import { computed, inject, ref, onMounted } from "vue";

const props = defineProps(["word", "verse"]);
const linkIds = inject("linkIds");
const lnkMethods = inject("lnkMethods");

const wordObj = ref(null);

const categoryStyle = computed(() => {
  if (props.word.word_linked) {
    if (linkIds.value.includes(props.word.link)) {
      let cat = lnkMethods.getCategory(props.word.link, props.word.col);
      if (cat && cat.display) {
        return {
          backgroundColor: cat.color,
        };
      }
    }
  }

  return {}; // no category linked
});

const scrollIn = inject('scrollIn');
onMounted(function () {
  if (props.word.anchor) {
    scrollIn(wordObj.value);
  }
});
</script>

<style scoped></style>

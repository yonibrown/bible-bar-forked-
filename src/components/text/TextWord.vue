<template>
  <span :style="wordStyle" ref="wordObj" :res-word="word.id">
    {{ word.word }}
  </span>
  <span class="text_space" :style="spaceStyle" :res-word="0.5 + word.id">
    {{ word.space }}
  </span>
</template>

<script setup>
import { computed, inject, ref, onMounted } from "vue";

const props = defineProps(["word", "verse","endStyle"]);

const linkedParts = inject("linkedParts");
const wordObj = ref(null);

const wordFirstCat = computed(function () {
  for (let { prt, cat } of linkedParts.value) {
    if (
      cat.display &&
      // word in part
      (props.verse.position > prt.src_from_position ||
        (props.verse.position == prt.src_from_position &&
          props.word.id >= prt.src_from_word)) &&
      (props.verse.position < prt.src_to_position ||
        (props.verse.position == prt.src_to_position &&
          props.word.id <= prt.src_to_word))
    ) {
      return cat;
    }
  }
  return null;
});

const spaceFirstCat = computed(function () {
  for (let { prt, cat } of linkedParts.value) {
    if (
      cat.display &&
      // word in part (but not the last word in the part)
      (props.verse.position > prt.src_from_position ||
        (props.verse.position == prt.src_from_position &&
          props.word.id >= prt.src_from_word)) &&
      (props.verse.position < prt.src_to_position ||
        (props.verse.position == prt.src_to_position &&
          props.word.id < prt.src_to_word))
    ) {
      return cat;
    }
  }
  return null;
});

const wordStyle = computed(function () {
  if (wordFirstCat.value) {
    return {
      backgroundColor: wordFirstCat.value.color,
    };
  }
  return {}; // no category linked
});

const spaceStyle = computed(function () {
  if (spaceFirstCat.value) {
    return {
      backgroundColor: spaceFirstCat.value.color,
    };
  }
  // if it is the last word in the verse
  if (props.word.id == props.verse.txt_list.length - 1){
    return props.endStyle;
  }
  return {}; // no category linked
});

const scrollIn = inject("scrollIn");
onMounted(function () {
  if (props.word.anchor) {
    scrollIn(wordObj.value);
  }
});
</script>

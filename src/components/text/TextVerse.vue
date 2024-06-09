<template>
  <span :res-position="verse.position" res-word="-0.5">
    <span :style="beginingStyle">
      {{ space }}
      <span style="font-size: medium; color: #2243b2">{{
        verseTitle
      }}</span>
      {{ space }}
    </span>
    <span class="text">
      <text-word
        v-for="wrd in verse.txt_list"
        :key="wrd.id"
        :word="wrd"
        :verse="verse"
        :endStyle="endStyle"
      >
      </text-word>
    </span>
  </span>
</template>

<script setup>
import { computed, inject } from "vue";
import TextWord from "./TextWord.vue";

const props = defineProps(["verse"]);
const linkedParts = inject("linkedParts");
const element = inject("element");

const verseTitle = computed(function () {
  return element.value.numbering == "letters"
    ? props.verse.name_letter
    : props.verse.name_number;
});

const space = " ";

const beginingFirstCat = computed(function () {
  for (let { prt, cat } of linkedParts.value) {
    if (
      cat.display &&
      // the begining of the verse is in the part
      ((props.verse.position > prt.src_from_position &&
        props.verse.position <= prt.src_to_position) ||
        // or the entire verse is in the part
        ((props.verse.position > prt.src_from_position ||
          (props.verse.position == prt.src_from_position &&
            prt.src_from_word <= 0)) &&
          (props.verse.position < prt.src_to_position ||
            (props.verse.position == prt.src_to_position &&
              prt.src_to_word >= prt.src_to_word_count - 1))))
    ) {
      return cat;
    }
  }
  return null;
});

const endFirstCat = computed(function () {
  for (let { prt, cat } of linkedParts.value) {
    if (
      cat.display &&
      // the end of the verse is in the part
      ((props.verse.position >= prt.src_from_position &&
        props.verse.position < prt.src_to_position) ||
        // or the entire verse is in the part
        ((props.verse.position > prt.src_from_position ||
          (props.verse.position == prt.src_from_position &&
            prt.src_from_word <= 0)) &&
          (props.verse.position < prt.src_to_position ||
            (props.verse.position == prt.src_to_position &&
              prt.src_to_word >= prt.src_to_word_count - 1))))
    ) {
      return cat;
    }
  }
  return null;
});

const beginingStyle = computed(function () {
  if (beginingFirstCat.value) {
    return {
      backgroundColor: beginingFirstCat.value.color,
    };
  }
  return {}; // no category linked
});

const endStyle = computed(function () {
  if (endFirstCat.value) {
    return {
      backgroundColor: endFirstCat.value.color,
    };
  }
  return {}; // no category linked
});
</script>

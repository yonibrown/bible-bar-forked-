<template>
  <span>
    <word-in-range
      v-for="(word, idx) in words"
      :word="word"
      :wordIdx="idx"
      :key="idx"
    >
    </word-in-range>
  </span>
</template>

<script setup>
import WordInRange from "./WordInRange.vue";
import { computed, provide, inject } from "vue";
const props = defineProps(["text", "fromWord", "toWord"]);

const changeValue = inject("changeValue");

const words = computed(function () {
  return props.text
    .replaceAll(/[\s־׃]/g, (ch) => {
      return ch + "w";
    })
    .split("w");
});

const lastWord = computed(function () {
  return words.value.length - 2;
});

function idxInRange(idx, from, to) {
  return Math.min(Math.max(idx, from), to);
}

const dividerFromIdx = computed(function () {
  if (typeof props.fromWord != 'undefined') {
    return idxInRange(props.fromWord, 0, lastWord.value);
  }
  return -1;
});
provide("dividerFromIdx", dividerFromIdx);

const dividerToIdx = computed(function () {
  if (props.toWord) {
    return idxInRange(props.toWord, 0, lastWord.value);
  }
  return 999;
});
provide("dividerToIdx", dividerToIdx);

function setDivider(idx, wordDivider) {
  var updAttr = {};
  if (wordDivider == "from" && typeof props.fromWord != 'undefined') {
    if (idx < dividerFromIdx.value) {
      updAttr.src_from_word = idx;
    } else {
      if (idx < dividerToIdx.value) {
        updAttr.src_from_word = idx + 1;
      } else {
        if (idx == dividerToIdx.value) {
          updAttr.src_from_word = idx;
        } else {
          updAttr.src_from_word = dividerToIdx.value + 1;
          updAttr.src_to_word = idx;
        }
      }
    }
  }

  if (wordDivider == "to" && props.toWord) {
    if (idx > dividerToIdx.value) {
      updAttr.src_to_word = idx;
    } else {
      if (idx > dividerFromIdx.value) {
        updAttr.src_to_word = idx - 1;
      } else {
        if (idx == dividerFromIdx.value) {
          updAttr.src_to_word = idx;
        } else {
          updAttr.src_to_word = dividerFromIdx.value - 1;
          updAttr.src_from_word = idx;
        }
      }
    }
  }

  if ("src_from_word" in updAttr) {
    updAttr.src_from_word = idxInRange(
      updAttr.src_from_word,
      0,
      lastWord.value,
    );
  }
  if ("src_to_word" in updAttr) {
    updAttr.src_to_word = idxInRange(updAttr.src_to_word, 0, lastWord.value);
  }
  changeValue(updAttr);
}
provide("setDivider", setDivider);

function hilightWord(idx) {
  console.log("hilightWord", idx);
}
provide("hilightWord", hilightWord);
</script>

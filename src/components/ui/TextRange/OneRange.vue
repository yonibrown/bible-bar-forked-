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
import { ref, computed, provide } from "vue";
const props = defineProps(["text", "fromWord", "toWord"]);

const dividerFromIdx = ref(-1);
provide("dividerFromIdx", dividerFromIdx);
if (props.fromWord) {
  dividerFromIdx.value = props.fromWord;
}

const dividerToIdx = ref(999);
provide("dividerToIdx", dividerToIdx);
if (props.toWord) {
  dividerToIdx.value = props.toWord;
}

const hilightFromWordIdx = ref(999);
provide("hilightFromWordIdx", hilightFromWordIdx);

const hilightToWordIdx = ref(-1);
provide("hilightToWordIdx", hilightToWordIdx);

function setDivider(idx, wordDivider) {
  console.log("setDivider", idx);
  if (wordDivider == "from" && props.fromWord) {
    if (idx > dividerToIdx.value) {
      dividerFromIdx.value = dividerToIdx.value;
      dividerToIdx.value = idx + 1;
    } else {
      dividerFromIdx.value = idx;
    }
  }
  if (wordDivider == "to" && props.toWord) {
    if (idx < dividerFromIdx.value) {
      dividerToIdx.value = dividerFromIdx.value;
      dividerFromIdx.value = idx;
    } else {
      dividerToIdx.value = idx - 1;
    }
  }
}
provide("setDivider", setDivider);

function hilightWord(idx) {
  console.log("hilightWord", idx);
}
provide("hilightWord", hilightWord);

const words = computed(function () {
  return props.text
    .replaceAll(/[\s־׃]/g, (ch) => {
      return ch + "w";
    })
    .split("w");
});
</script>

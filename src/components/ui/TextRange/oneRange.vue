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
import WordInRange from "./wordInRange.vue";
import { ref, computed, provide } from "vue";
const props = defineProps(["text", "fromWord", "toWord"]);

console.log('from',props.fromWord);
console.log('to',props.toWord);

const dividerFromIdx = ref(-1);
provide("dividerFromIdx", dividerFromIdx);
if (props.fromWord){
    dividerFromIdx.value = props.fromWord;
}

const dividerToIdx = ref(999);
provide("dividerToIdx", dividerToIdx);
if (props.toWord){
    dividerToIdx.value = props.toWord;
}

const hilightFromWordIdx = ref(999);
provide("hilightFromWordIdx", hilightFromWordIdx);

const hilightToWordIdx = ref(-1);
provide("hilightToWordIdx", hilightToWordIdx);

function setDivider(idx) {
  console.log("setDivider", idx);
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

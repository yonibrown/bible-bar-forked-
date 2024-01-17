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

const dividerWordIdx = ref(props.fromWord);
provide("dividerWordIdx", dividerWordIdx);

function setDivider(idx) {
  console.log("setDivider", idx);
}
provide("setDivider", setDivider);

const words = computed(function () {
  return props.text
    .replaceAll(/[\s־׃]/g, (ch) => {
      return "x" + ch + "x";
    })
    .split("x");
});
</script>

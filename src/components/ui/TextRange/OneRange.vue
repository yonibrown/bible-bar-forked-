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
import { ref, computed, provide,inject } from "vue";
const props = defineProps(["text", "fromWord", "toWord"]);

const changeValue = inject("changeValue");

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

function setDivider(idx, wordDivider) {
  if (wordDivider == "from" && props.fromWord) {
    if (idx < dividerFromIdx.value) {
      dividerFromIdx.value = idx;
    } else {
      if (idx < dividerToIdx.value) {
        dividerFromIdx.value = idx + 1;
      } else {
        if (idx == dividerToIdx.value) {
          dividerFromIdx.value = idx;
        } else {
          dividerFromIdx.value = dividerToIdx.value + 1;
          dividerToIdx.value = idx;
        }
      }
    }
  }

  if (wordDivider == "to" && props.toWord) {
    if (idx > dividerToIdx.value) {
      dividerToIdx.value = idx;
    } else {
      if (idx > dividerFromIdx.value) {
        dividerToIdx.value = idx - 1;
      } else {
        if (idx == dividerFromIdx.value) {
          dividerToIdx.value = idx;
        } else {
          dividerToIdx.value = dividerFromIdx.value - 1;
          dividerFromIdx.value = idx;
        }
      }
    }
  }

  if (dividerFromIdx.value == words.value.length - 1) {
    dividerFromIdx.value--;
  }
  if (dividerToIdx.value == -1) {
    dividerToIdx.value++;
  }
  changeValue('xxx');
}
provide("setDivider", setDivider);

function hilightWord(idx) {
  // console.log("hilightWord", idx);
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

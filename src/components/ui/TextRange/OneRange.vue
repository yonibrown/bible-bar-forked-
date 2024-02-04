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
import { ref, computed, provide, inject } from "vue";
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
  var updAttr = {};
  if (wordDivider == "from" && props.fromWord) {
    if (idx < dividerFromIdx.value) {
      dividerFromIdx.value = idx;
      updAttr.src_from_word = idx;
    } else {
      if (idx < dividerToIdx.value) {
        dividerFromIdx.value = idx + 1;
        updAttr.src_from_word = idx + 1;
      } else {
        if (idx == dividerToIdx.value) {
          dividerFromIdx.value = idx;
          updAttr.src_from_word = idx;
        } else {
          dividerFromIdx.value = dividerToIdx.value + 1;
          updAttr.src_from_word = dividerToIdx.value + 1;
          dividerToIdx.value = idx;
          updAttr.src_to_word = idx;
        }
      }
    }
  }

  if (wordDivider == "to" && props.toWord) {
    if (idx > dividerToIdx.value) {
      dividerToIdx.value = idx;
      updAttr.src_to_word = idx;
    } else {
      if (idx > dividerFromIdx.value) {
        dividerToIdx.value = idx - 1;
        updAttr.src_to_word = idx - 1;
      } else {
        if (idx == dividerFromIdx.value) {
          dividerToIdx.value = idx;
          updAttr.src_to_word = idx;
        } else {
          dividerToIdx.value = dividerFromIdx.value - 1;
          updAttr.src_to_word = dividerFromIdx.value - 1;
          dividerFromIdx.value = idx;
          updAttr.src_from_word = idx;
        }
      }
    }
  }

  if (dividerFromIdx.value == words.value.length - 1) {
    dividerFromIdx.value--;
    updAttr.src_from_word--;
  }
  if (dividerToIdx.value == -1) {
    dividerToIdx.value++;
    updAttr.src_to_word++;
  }
  changeValue(updAttr);
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

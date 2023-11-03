<template>
  <span :style="categoryStyle" ref="wordObj">{{ word.word }} </span>
  <span class="text_space">{{ word.space }}</span>
</template>

<script setup>
import { computed, inject, ref, onMounted } from "vue";

const props = defineProps(["word", "verse"]);
const linkIds = inject("linkIds");
const getCategory = inject("getCategory");
const textBox = inject("textBox");

const wordObj = ref(null);

const categoryStyle = computed(() => {
  if (props.word.word_linked) {
    if (linkIds.value.includes(props.word.link)) {
      let cat = getCategory(props.word.link, props.word.col);
      if (cat && cat.display) {
        return {
          backgroundColor: cat.color,
        };
      }
    }
  }

  return {}; // no category linked
});
onMounted(function () {
  if (props.word.word == "נְדִיבִים") {
    console.log(props.word);
    console.log(
      'textBox.scrollTop',
      textBox.value.scrollTop,
    );
    console.log(
      'textBox.scrollHeight',
      textBox.value.scrollHeight,
    );
    console.log(
      'textBox.offsetTop',
      textBox.value.offsetTop,
    );
    console.log(
      'wordObj.offsetTop',
      wordObj.value.offsetTop,
    );
  }
  if (props.word.anchor) {
    // console.log()
    // wordObj.value.scrollIntoView({behavior: "smooth", block: 'nearest', inline: 'nearest' });
    // console.log(textBox.value.scrollTop, wordObj.value.offsetTop);
    textBox.value.scrollTop = wordObj.value.offsetTop - textBox.value.offsetTop;
    // console.log(textBox, wordObj);
    // console.log(
    //   textBox.value.scrollTop,
    //   textBox.value.scrollHeight,
    //   wordObj.value.offsetTop
    // );
    // wordObj.value.scrollTo({
    //   top: textBox.value.offsetTop,
    //   left: 0,
    //   behavior: "smooth",
    // });
  }
});
</script>

<style scoped></style>

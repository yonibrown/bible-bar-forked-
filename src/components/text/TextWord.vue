<template>
  <span :style="wordStyle" ref="wordObj" :res-word="word.id"
    >{{ word.word }}
  </span>
  <span class="text_space" :style="spaceStyle" :res-word="0.5 + word.id">{{
    word.space
  }}</span>
</template>

<script setup>
import { computed, inject, ref, onMounted } from "vue";
import { biLink } from "../../store/biLink.js";

const props = defineProps(["word", "verse"]);
const linkIds = inject("linkIds");

const project = inject("project");
const links = inject("links");

const wordObj = ref(null);

const wordFirstCategory = computed(function () {
  for (let link of links.value) {
    for (let cat of link.categories) {
      let res = project.value.getResearch(cat.res);
      let col = res.getCollection(cat.col);
      let parts = col.parts;
      for (let prt of parts) {
        if (
          props.verse.position >= prt.src_from_position &&
          props.verse.position <= prt.src_to_position
        ) {
          console.log("part", prt);
        }
      }
    }
  }
  return null;
});

const categoryStyle = computed(function () {
  console.log(
    "word",
    props.word,
    props.verse,
    links.value,
    wordFirstCategory.value,
  );
  if (linkIds.value.includes(props.word.link)) {
    let cat = biLink.getCategory(props.word.link, props.word.col);
    if (cat && cat.display) {
      return {
        backgroundColor: cat.color,
      };
    }
  }
  return {}; // no category linked
});

const wordStyle = computed(function () {
  if (props.word.word_linked) {
    return categoryStyle.value;
  }
  return {}; // no category linked
});

const spaceStyle = computed(function () {
  if (props.word.space_linked) {
    return categoryStyle.value;
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

<style scoped></style>

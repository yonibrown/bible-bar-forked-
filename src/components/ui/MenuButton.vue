<template>
  <div class="fa" :class="faClass" :chosen="chosen"></div>
  <!-- v-tooltip.top="{ value: tooltip, showDelay: 900 }" -->
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["type", "chosen", "tooltip"]);

const faClass = computed(function () {
  switch (props.type) {
    case "clipboard":
      return "fa-copy";
    case "download":
      return "fa-download";
    case "add":
      return "fa-plus";
    case "reload":
      return "fa-rotate-right";
    case "close":
      return "fa-close";
    case "options":
      return "fa-bars";
    case "edit":
      return "fa-pencil";
    case "addtab":
      return "fa-columns";
    case "moveleft":
      return "fa-arrow-left";
    case "moveright":
      return "fa-arrow-right";
    case "moveup":
      return "fa-arrow-up";
    case "movedown":
      return "fa-arrow-down";
    case "sort-asc":
      return "fa-arrow-up";
    case "sort-desc":
      return "fa-arrow-down";
    case "SourceWord":
      return "fa-file-text-o";
    case "SourceVerse":
      return "fa-book";
    case "FreeText":
      return "fa-align-right"; /* fa-pencil  fa-quote-right fa-book fa-book-open */
    default:
      return null;
  }
});
</script>

<style scoped>
div {
  cursor: default;
  /* float: left; */
  color: rgb(177, 177, 177);
  margin-right: 6px;
  padding: 4px;
  position: relative;
}
div:hover,
div[chosen="true"] {
  color: black;
  background-color: rgb(223, 228, 235);
}
</style>

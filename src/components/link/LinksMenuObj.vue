<template>
  <div class="link-obj" @dblclick="openLink">
    <span>{{ name }}</span>
    <menu-button type="close" @click="removeLink"></menu-button>
  </div>
</template>

<script setup>
import MenuButton from "../ui/MenuButton.vue";
import { computed, inject } from "vue";
const props = defineProps(["link"]);
const element = inject("element");

const name = computed(function () {
  return props.link.name;
});

function removeLink() {
  props.link.removeElementFromLink( element.value.id);
}

const createElement = inject("createElement");
function openLink() {
  createElement({
    type: "link",
    link_id: props.link.id,
  });
}
</script>

<style scoped>
.link-obj {
  background-color: rgb(232, 250, 250);
  width: fit-content;
  padding: 2px;
  font-size: 80%;
  border-style: solid;
  border-width: 0.1px;
  border-color: rgb(119, 119, 119);
  user-select: none;
  display: inline;
  cursor: grab;
}
</style>

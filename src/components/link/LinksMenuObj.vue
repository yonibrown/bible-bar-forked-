<template>
  <div class="link-obj">
    <span>{{ name }}</span>
    <menu-button type="close" @click="$emit('removeLink')"></menu-button>
  </div>
</template>

<script setup>
import MenuButton from "../ui/MenuButton.vue";
import { computed } from "vue";
const props = defineProps(["link"]);
// const emit = defineEmits(["removeLink"]);

const name = computed(function () {
  if (props.link.name == "") {
    return "link" + props.link.id;
  }
  return props.link.name;
});

// function removeLink() {
//   emit("removeLink");
// }
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

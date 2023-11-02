<template>
  <div class="element-dropable">
    <span>הדגשות:</span>
    <links-menu-obj
      v-for="link in links"
      :key="link.id"
      :link="link"
      @removeLink="$emit('removeLink',link)"
    ></links-menu-obj>
  </div>
</template>

<script setup>
import { inject } from "vue";
import LinksMenuObj from "./LinksMenuObj.vue";
// const emit = defineEmits(['removeLink']);

const links = inject("links");
</script>

<style scoped>
div * {
  margin-left: 3px;
}
</style>

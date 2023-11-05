<template>
  <base-menu :hilightMenu="hilightMenu">
    <span>הדגשות:</span>
    <links-menu-obj
      v-for="link in links"
      :key="link.id"
      :link="link"
      @removeLink="$emit('removeLink',link)"
    ></links-menu-obj>
  </base-menu>
</template>

<script setup>
import { inject } from "vue";
import LinksMenuObj from "./LinksMenuObj.vue";

const props = defineProps(['hilightMenu']);
console.log('hilightMenu',props.hilightMenu);

const links = inject("links");
</script>

<style scoped>
div * {
  margin-left: 3px;
}
</style>

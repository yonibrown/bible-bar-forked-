<template>
  <div class="head">
    <div class="title">{{ element.type }}</div>
    <div class="menu-button fa fa-bars" @click="toggleMenu"></div>
  </div>
  <div class="menu" v-show="displayMenu">
    <bar-menu v-if="element.type == 'bar'" :element="element"></bar-menu>
    <span v-else>Some options...</span>
  </div>
  <link-box v-if="element.type == 'link'" :element="element"></link-box>
  <bar-box v-else-if="element.type == 'bar'" :element="element"></bar-box>
  <text-box v-else-if="element.type == 'text'" :element="element"></text-box>
  <parts-box v-else-if="element.type == 'parts'" :element="element"></parts-box>
  <h3 v-else>Unknown element</h3>
</template>

<script setup>
import LinkBox from '../links/LinkBox.vue';
import BarBox from '../bars/BarBox.vue';
import TextBox from '../texts/TextBox.vue';
import PartsBox from '../parts/PartsBox.vue';

import BarMenu from '../bars/BarMenu.vue';

import { provide, computed, inject, ref } from 'vue';

const props = defineProps(['element']);

const projectId = inject('projectId');
const elementId = computed(function () {
  return {
    elm: props.element.id,
    ...projectId.value,
  };
});
provide('elementId', elementId);

function updateElement(data) {
  Object.assign(props.element, data);
}
provide('updateElement', updateElement);

const displayMenu = ref(false);
function toggleMenu(){
  displayMenu.value = !displayMenu.value;
}

</script>


<style scoped>
.menu{
  background-color: rgb(216, 216, 216);
  border-style: solid;
  border-width: 0.1px;
  border-color: rgb(190, 190, 190);
  margin: 5px 0px 5px 0px;
  padding: 5px 15px 5px 15px;
}

.menu-button {
  float: left;
  color: gray;
}
.menu-button:hover {
  color: black;
}
.title {
  float: right;
  font-weight: bold;
  font-size: 1.17em;
}

.head {
  margin: 0em 0em 1em 0em;
}
</style>

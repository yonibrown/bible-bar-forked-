<template>
  <div class="head">
    <div class="title">{{ element.type }}</div>
    <div class="menu-button fa fa-bars" @click="toggleMenu"></div>
  </div>
  <div class="menu" v-show="displayMenu">
    <component
      :is="element.type + '-menu'"
      :element="element"
    ></component>
  </div>
  <component
    :is="element.type + '-box'"
    :element="element"
  ></component>
</template>

<script setup>
import { provide, computed, inject, ref } from 'vue';
import { sendToServer } from '../../server.js';

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
function toggleMenu() {
  displayMenu.value = !displayMenu.value;
}

const hasToReload = ref(false);
provide('hasToReload',hasToReload);

function reloaded(){
  hasToReload.value = false;
}
provide('reloaded',reloaded);

async function reloadElement() {
  const data = {
    type: 'element',
    oper: 'get',
    id: elementId.value,
    prop: { dummy: '' },
  };

  const obj = await sendToServer(data);
  updateElement({
    attr: obj.data,
  });
  hasToReload.value = true;
}

async function changeAttr(changedAttr) {
  const data = {
    type: 'element',
    oper: 'set',
    id: elementId.value,
    prop: changedAttr,
  };

  const obj = await sendToServer(data);
  reloadElement();
}
provide('changeAttr',changeAttr);
</script>

<style scoped>
.menu {
  background-color: rgb(230, 230, 230);
  border-style: solid;
  border-width: 0.1px;
  border-color: rgb(206, 206, 206);
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

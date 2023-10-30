<template>
  <base-card>
    <div class="element-head">
      <div class="title">{{ props.element.type }}</div>
      <div class="menu-button fa fa-close" @click="closeElement"></div>
      <div class="menu-button fa fa-bars" @click="toggleMenu"></div>
    </div>
    <div class="menu" v-show="displayMenu">
      <component
        :is="props.element.type + '-menu'"
        :element="element"
      ></component>
    </div>
    <component :is="props.element.type + '-box'" :element="element"></component>
  </base-card>
</template>

<script setup>
import { provide, computed, inject, ref  } from "vue";
import { sendToServer } from "../../server.js";

const props = defineProps(["element"]);
const emit = defineEmits(["closeElement"]);

const elementAttr = ref(props.element.attr);

const projectId = inject("projectId");
const elementId = computed(function () {
  return {
    elm: props.element.id,
    ...projectId.value,
  };
});
provide("elementId", elementId);

const displayMenu = ref(false);
function toggleMenu() {
  displayMenu.value = !displayMenu.value;
}

function closeElement() {
  emit("closeElement");
}

const hasToReload = ref(false);
provide("hasToReload", hasToReload);

function reloaded() {
  hasToReload.value = false;
}
provide("reloaded", reloaded);

async function reloadElement() {
  const data = {
    type: "element",
    oper: "get",
    id: elementId.value,
    prop: { dummy: "" },
  };

  const obj = await sendToServer(data);
  elementAttr.value = obj.data;
  hasToReload.value = true;
}

async function changeAttr(changedAttr) {
  const data = {
    type: "element",
    oper: "set",
    id: elementId.value,
    prop: changedAttr,
  };

  const obj = await sendToServer(data);
  reloadElement();
}
provide("changeAttr", changeAttr);

const openElement = inject("openElement");
function openElementFromElement(attr) {
  openElement({
    opening_element: props.element.id,
    ...attr,
  });
}
provide("openElement", openElementFromElement);
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
  cursor: default;
  float: left;
  color: rgb(146, 146, 146);
  margin-right: 6px;
  padding: 4px;
}
.menu-button:hover {
  color: black;
  background-color: rgb(230, 230, 230);
}
.title {
  cursor: default;
  float: right;
  font-weight: bold;
  font-size: 1.17em;
}

.elemant_head {
  margin: 0em 0em 1em 0em;
  cursor: grab;
}
</style>

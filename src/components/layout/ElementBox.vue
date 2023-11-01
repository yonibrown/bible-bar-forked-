<template>
  <base-card>
    <div class="element-head">
      <base-editable
        v-if="editingName"
        :initialValue="elementName"
        @submitValue="submitName"
        :name="elementName"
      ></base-editable>
      <div v-else @dblclick="starteditName" class="title">
        {{ elementName }}
      </div>
      <span class="menu-buttons">
      <menu-button type="options" @click="toggleMenu"></menu-button>
      <menu-button type="close" @click="closeElement"></menu-button>
    </span>
    </div>
    <div v-show="displayMenu">
      <component class="menu"
        :is="props.element.type + '-menu'"
        :element="element"
      ></component>
      <links-menu class="menu" v-if="displayLinksMenu" @removeLink="removeLink"></links-menu>
    </div>
    <component :is="props.element.type + '-box'" :element="element"></component>
  </base-card>
</template>

<script setup>
import MenuButton from '../ui/MenuButton.vue';
import { provide, computed, inject, ref } from "vue";
import { sendToServer } from "../../server.js";

const props = defineProps(["element"]);
const emit = defineEmits(["closeElement"]);
const getLink = inject('getLink');

const elementAttr = ref(props.element.attr);

const projectId = inject("projectId");
const elementId = computed(function () {
  return {
    elm: props.element.id,
    ...projectId.value,
  };
});
provide("elementId", elementId);

// element name
const defaultName = getDefaultName();
function getDefaultName(){
  if (props.element.type == 'link'){
    const link = getLink(props.element.attr.link_id);
    if (link){
      if (link.name != ''){
        return link.name;
      } else {
        return 'link'+link.id;
      }
    }
  }
  return 'element' + props.element.id;
}

const elementName = ref(defaultName);
if (props.element.disp.name != "") {
  elementName.value = props.element.disp.name;
}

const editingName = ref(false);
function starteditName() {
  editingName.value = true;
}
function submitName(newName) {
  if (newName == "") {
    elementName.value = defaultName;
  } else {
    elementName.value = newName;
  }
  editingName.value = false;

  changeAttr({
    name: newName,
  });
}

// display menu
const displayMenu = ref(false);
function toggleMenu() {
  displayMenu.value = !displayMenu.value;
}
const displayLinksMenu = computed(function(){
  return props.element.type != 'link';
});

// close element button
function closeElement() {
  emit("closeElement");
}

// reload element
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

// change attributes of element
async function changeAttr(changedAttr, options) {
  const data = {
    type: "element",
    oper: "set",
    id: elementId.value,
    prop: changedAttr,
  };

  const obj = await sendToServer(data);

  if (options && options.reload) {
    reloadElement();
  }
}
provide("changeAttr", changeAttr);

// open a new element
const openElement = inject("openElement");
function openElementFromElement(attr) {
  openElement({
    opening_element: props.element.id,
    ...attr,
  });
}
provide("openElement", openElementFromElement);

//links
const projLinks = inject('links');
const links = computed(function(){
  return projLinks.value.filter(function(link){
    return link.elements.find(function(elmId){
      return elmId == props.element.id;
    });
  });
});
provide('links',links);

const unlinkElement = inject('unlinkElement');
function removeLink(link){
  unlinkElement(link,props.element);
}

</script>

<style scoped>
form {
  display: inline;
}
button {
  margin-right: 5px;
}

.menu-buttons {
  float: left;
}

.menu {
  background-color: rgb(230, 230, 230);
  border-style: solid;
  border-width: 0.1px;
  border-color: rgb(206, 206, 206);
  margin: 5px 0px 5px 0px;
  padding: 5px 15px 5px 15px;
}

.title {
  cursor: default;
  float: right;
  font-weight: bold;
  font-size: 1.17em;
}

.element-head {
  margin: 0em 0em 1em 0em;
  cursor: grab;
}
</style>

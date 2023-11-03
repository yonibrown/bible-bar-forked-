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
        <!-- <menu-button type="reload" @click="reloadElement"></menu-button> -->
        <menu-button type="options" @click="toggleMenu"></menu-button>
        <menu-button type="close" @click="closeElement"></menu-button>
      </span>
    </div>
    <div v-show="displayMenu">
      <sequence-menu
        v-if="displaySequenceMenu"
        class="menu"
        :elementAttr="elementAttr"
        :displayScale="displayScale"
        :enableWholeText="enableWholeText"
      ></sequence-menu>
      <base-dropable
        :drop="addToLinks"
        :dragStruct="['linkId']"
        :dragEnter="enterLinksMenu"
        :dragLeave="leaveLinksMenu"
      >
        <links-menu
          class="menu"
          :class="{ 'hilight-menu': hilightLinksMenu }"
          v-if="displayLinksMenu"
          @removeLink="removeLink"
        ></links-menu>
      </base-dropable>
    </div>
    <component
      :is="element.type + '-box'"
      :elementAttr="elementAttr"
    ></component>
  </base-card>
</template>

<script setup>
import SequenceMenu from "../sequence/SequenceMenu.vue";
import LinksMenu from "../link/LinksMenu.vue";

import MenuButton from "../ui/MenuButton.vue";
import { provide, computed, inject, ref } from "vue";
import { sendToServer } from "../../server.js";

const props = defineProps(["element"]);
const emit = defineEmits(["closeElement"]);
const getLink = inject("getLink");
const linkElement = inject("linkElement");

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
function getDefaultName() {
  if (props.element.type == "link") {
    const link = getLink(elementAttr.value.link_id);
    if (link) {
      if (link.name != "") {
        return link.name;
      } else {
        return "link" + link.id;
      }
    }
  }
  return "element" + props.element.id;
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
const displaySequenceMenu = computed(function () {
  return props.element.type == "bar" || props.element.type == "text";
});
const displayScale = computed(function () {
  return props.element.type == "bar";
});
const enableWholeText = computed(function () {
  return props.element.type == "bar";
});
const displayLinksMenu = computed(function () {
  return props.element.type != "link";
});
const hilightLinksMenu = ref(false);
function enterLinksMenu() {
  hilightLinksMenu.value = true;
}
function leaveLinksMenu() {
  hilightLinksMenu.value = false;
}
function addToLinks(dragData) {
  const linkId = +dragData.linkId;
  if (linkId != 0) {
    const link = getLink(linkId);
    linkElement(link, props.element.id);
  }
}

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
  console.log("reloadElement");
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
const projLinks = inject("links");
const links = computed(function () {
  return projLinks.value.filter(function (link) {
    return link.elements.find(function (elmId) {
      return elmId == props.element.id;
    });
  });
});
provide("links", links);

const linkIds = computed(function () {
  return links.value.map(function (link) {
    return link.id;
  });
});
provide("linkIds", linkIds);

const unlinkElement = inject("unlinkElement");
function removeLink(link) {
  unlinkElement(link, props.element.id);
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

.hilight-menu {
  background-color: rgb(255, 238, 238);
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

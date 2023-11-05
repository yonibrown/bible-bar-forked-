<template>
  <base-card>
    <div class="element-head">
      <base-editable
        :initialValue="elementName"
        @submitValue="submitName"
        name="elementName"
        :defaultValue="defaultName"
      ></base-editable>
      <span class="menu-buttons">
        <!-- <menu-button type="reload" @click="reloadElement"></menu-button> -->
        <menu-button
          v-if="displayOptionsButton"
          type="options"
          @click="toggleMenu"
        ></menu-button>
        <menu-button type="close" @click="closeElement"></menu-button>
      </span>
    </div>
    <div v-show="displayOptions">
      <sequence-menu
        v-if="displaySequenceMenu"
        :elementAttr="elementAttr"
        :displayScale="displayScale"
        :enableWholeText="enableWholeText"
      ></sequence-menu>
      <base-droppable
        :drop="addToLinks"
        :dragStruct="['linkId']"
        :dragEnter="enterLinksMenu"
        :dragLeave="leaveLinksMenu"
        ><links-menu
          v-if="displayLinksMenu"
          @removeLink="unlinkElement"
          :hilightMenu="hilightLinksMenu"
        ></links-menu>
      </base-droppable>
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
import { provide, computed, inject, ref, watch } from "vue";
import { sendToServer } from "../../server.js";

const props = defineProps(["element"]);
const emit = defineEmits(["closeElement"]);
const getLink = inject("getLink");

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
const defaultName = computed(getDefaultName);
function getDefaultName() {
  if (props.element.type == "new") {
    return "new element";
  }
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

const elementName = ref(defaultName.value);
if (props.element.name.trim() != "") {
  elementName.value = props.element.name;
}

function submitName(newName) {
  elementName.value = newName;
  changeAttr({
    name: newName,
  });
}

// display menu
const displayOptions = ref(false);
function toggleMenu() {
  displayOptions.value = !displayOptions.value;
}

const displayOptionsButton = computed(function () {
  return props.element.type != "new";
});
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
    linkElement(link);
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
  elementAttr.value = obj.data;
  hasToReload.value = true;
}

// change attributes of element
async function changeAttr(changedAttr, options) {
  if (props.element.type == "new") {
    return;
  }
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
const createElement = inject("createElement");
function createElementFromElement(attr) {
  const newAttr = { ...attr };
  const options = {};
  if (props.element.type == "new") {
    newAttr.position = props.element.position;
    newAttr.name = elementName.value;
    options.openingElement = props.element;
  } else {
    newAttr.opening_element = props.element.id;
  }
  createElement(newAttr, options);
}
provide("createElement", createElementFromElement);

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

async function linkElement(link) {
  if (!link.elements.includes(props.element.id)) {
    link.elements.push(props.element.id);
  }

  const data = {
    type: "link",
    oper: "add_elm",
    id: {
      proj: projectId.value.proj,
      link: link.id,
    },
    prop: { elm: props.element.id },
  };
  const obj = await sendToServer(data);
}

async function unlinkElement(link) {
  link.elements = link.elements.filter(function (arrElmId) {
    return arrElmId != props.element.id;
  });

  const data = {
    type: "link",
    oper: "remove_elm",
    id: {
      proj: projectId.value.proj,
      link: link.id,
    },
    prop: { elm: props.element.id },
  };
  const obj = await sendToServer(data);
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

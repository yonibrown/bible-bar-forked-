<template>
  <base-card>
    <div class="draggable-head">
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
    <component
      :is="element.type + '-box'"
      :elementAttr="elementAttr"
      ref="boxRef"
    ></component>
  </base-card>
</template>

<script setup>
import MenuButton from "../ui/MenuButton.vue";
import { provide, computed, inject, ref } from "vue";
import { sendToServer } from "../../server.js";

const props = defineProps(["element", "nextPos"]);
const emit = defineEmits(["closeElement"]);
const getLink = inject("getLink");

const elementAttr = ref(props.element.attr);
provide("elementAttr", elementAttr);

const boxRef = ref();

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
provide("displayOptions", displayOptions);

function toggleMenu() {
  displayOptions.value = !displayOptions.value;
}

const displayOptionsButton = computed(function () {
  return props.element.type != "new";
});

// close element button
function closeElement() {
  emit("closeElement");
}

async function reloadElement() {
  const data = {
    type: "element",
    oper: "get",
    id: elementId.value,
    prop: { dummy: "" },
  };

  const obj = await sendToServer(data);
  elementAttr.value = obj.data.attr;
  boxRef.value.reload();
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
  options.openingElement = props.element;
  if (props.element.type == "new") {
    newAttr.position = props.element.position;
    newAttr.name = elementName.value;
  } else {
    newAttr.opening_element = props.element.id;
    newAttr.name = "";
    newAttr.position = props.nextPos;
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
  /* float: right; */
  font-weight: bold;
  font-size: 1.17em;
}

.draggable-head {
  margin: 0em 0em 1em 0em;
  cursor: grab;
}
</style>

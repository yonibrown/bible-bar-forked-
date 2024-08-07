<template>
  <base-card :shadow="true" :initialYAdd="elementYAdd" @resize="resizeElement">
    <div class="draggable-head">
      <base-editable
        :initialValue="elementName"
        @submitValue="submitName"
        name="elementName"
        :getDefault="defaultName"
      ></base-editable>
      <span class="menu-buttons">
        <!-- <menu-button type="reload" @click="reloadElement"></menu-button> -->
        <menu-button type="clipboard" @click="copyToClipboard"></menu-button>
        <menu-button
          v-if="displayOptionsButton"
          type="edit"
          @click="toggleMenu"
        ></menu-button>
        <menu-button type="close" @click="closeElement"></menu-button>
      </span>
    </div>
    <component :is="element.type + '-box'" ref="boxRef"></component>
  </base-card>
</template>

<script setup>
import MenuButton from "../ui/MenuButton.vue";
import { provide, computed, inject, ref } from "vue";

const props = defineProps(["element", "nextPos"]);
const emit = defineEmits(["closeElement"]);
const project = inject("project");

const elementAttr = computed(function () {
  return props.element.attr;
});
provide("elementAttr", elementAttr);

const boxRef = ref();

const elementObj = computed(function () {
  return props.element;
});
provide("element", elementObj);

// element name
function defaultName() {
  console.log('name 4 - ElementBox.defaultName');
  return props.element.defaultName;
}

const elementName = computed(function () {
  console.log('name 3 - ElementBox.elementName');
  return props.element.name;
});

function submitName(newName) {
  props.element.setName(newName);
}

const elementYAdd = computed(function () {
  return props.element.yAddition;
});

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

// change attributes of element
function changeAttr(changedAttr) {
  props.element.changeAttr(changedAttr);
}
provide("changeAttr", changeAttr);

// open a new element
function createElement(attr) {
  project.value.createFromElement({
    attr,
    name: elementName.value,
    position: props.nextPos,
    originalElement: props.element,
    originalLinks: links.value,
  });
}
provide("createElement", createElement);

async function openText(prop, openInSameElement) {
  if (openInSameElement && props.element.open_text_element != 0) {
    const txtElm = project.value.getElement(props.element.open_text_element);
    if (txtElm) {
      if (txtElm.position <= 0) {
        prop.position = props.nextPos;
      }
      await txtElm.changeAttr(prop);
      await txtElm.setName("");
      if (txtElm.position <= 0) {
        txtElm.position = props.nextPos;
      }
      return;
    }
  }

  createElement(prop);
}
provide("openText", openText);

//links
const projLinks = inject("links");
const links = computed(function () {
  // return a list of links that are linked to this element
  return projLinks.value.filter(function (link) {
    return (
      link.id == project.value.primaryLink ||
      link.elements.find(function (elmId) {
        return elmId == props.element.id;
      })
    );
  });
});
provide("links", links);

const linkIds = computed(function () {
  return links.value.map(function (link) {
    return link.id;
  });
});
provide("linkIds", linkIds);

function copyToClipboard() {
  boxRef.value.copyToClipboard();
}

function resizeElement(yAddition) {
  changeAttr({ y_addition: yAddition });
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
  /* float: right; */
  font-weight: bold;
  font-size: 1.17em;
}

.draggable-head {
  margin: 0em 0em 1em 0em;
  cursor: grab;
}
</style>

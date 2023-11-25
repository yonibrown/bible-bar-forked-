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
const lnkMethods = inject("lnkMethods");
const elmMethods = inject("elmMethods");

const elementAttr = ref(props.element.attr);
provide("elementAttr", elementAttr);

const boxRef = ref();

const projectId = inject("projectId");
const elementObjId = computed(function () {
  return {
    elm: props.element.id,
    ...projectId.value,
  };
});
provide("elementObjId", elementObjId);

// element name
const defaultName = computed(getDefaultName);
function getDefaultName() {
  if (props.element.type == "new") {
    return "new element";
  }
  if (props.element.type == "link") {
    const link = lnkMethods.getLink(elementAttr.value.link_id);
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
  elementAttr.value = await elmMethods.loadElement(elementObjId.value);
  boxRef.value.reload();
}

// change attributes of element
async function changeAttr(changedAttr, options) {
  if (props.element.type == "new") {
    return;
  }

  await elmMethods.changeAttr(elementObjId.value,changedAttr);
  
  if (options && options.reload) {
    reloadElement();
  }
}
provide("changeAttr", changeAttr);

// open a new element
function createElementFromElement(attr) {
  elmMethods.createFromElement(
    attr,
    props.element,
    elementName.value,
    props.nextPos
  );
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

<template>
  <div>
    <section>
      <base-card>
        <h2>Project {{ project.id }}: {{ project.attr.name }}</h2>
      </base-card>
      <div
        v-for="(elm, dispElmIdx) in dispElements"
        :key="elm.id"
        draggable="true"
        @dragstart="startDrag($event, dispElmIdx)"
        @mousedown="startMouse($event)"
        @drop="onDrop($event, dispElmIdx)"
        @dragover.prevent
        @dragenter.prevent
      >
        <element-box
          :element="elm"
          @closeElement="closeElement(elm)"
        ></element-box>
      </div>
    </section>
  </div>
</template>

<script setup>
import ElementBox from "../components/layout/ElementBox.vue";
import { sendToServer } from "../server.js";
import { reactive, provide, computed, ref } from "vue";

const project = reactive({
  id: 1,
  attr: {
    name: "---",
    desc: "",
  },
  links: [],
});

const projectId = computed(function () {
  return { proj: project.id };
});
provide("projectId", projectId);

const elements = ref([]);
const dispElements = computed(function () {
  return elements.value
    .filter(function (a) {
      return +a.position > 0;
    })
    .sort(function (a, b) {
      return a.position - b.position;
    });
});

loadProject();

async function loadProject() {
  const data = {
    type: "project",
    oper: "get",
    id: projectId.value,
    prop: { dummy: "" },
  };
  const obj = await sendToServer(data);

  project.attr = {
    name: obj.data.name,
    desc: obj.data.desc,
  };
  elements.value = obj.data.elements;
  project.links = obj.data.links;
  // console.log('project loaded');
  // console.log(dispElements);
}

// add a new element or reload an element
function openElement(attr) {
  // if (typeof attr.opening_element != 'undefined'){
  //   var newElm = elements.value.find(function(dispElm){
  //     return dispElm.disp.opening_element == attr.opening_element;
  //   });
  // }

  createElement({
    proj: project.id,
    ...attr,
  });
}
provide("openElement", openElement);

async function createElement(attr) {
  const data = {
    type: "element",
    oper: "new",
    id: { dummy: "" },
    prop: attr,
  };
  const obj = await sendToServer(data);
  console.log(obj.id);
}

// link methods
function getLink(linkId) {
  const link = project.links.find((pLink) => {
    return pLink.id == linkId;
  });
  return link;
}
provide("getLink", getLink);

function getCategory(linkId, col) {
  const link = getLink(linkId);
  if (link == null) {
    return null;
  }
  const cat = link.categories.find((pCat) => {
    return pCat.col == col;
  });
  return cat;
}
provide("getCategory", getCategory);



function closeElement(elm) {
  elm.position = 0;
}

// drag and drop
var handle = null;
function startMouse(evt) {
  handle = evt.target.closest(".element-head");
}
function startDrag(evt, dispElmIdx) {
  if (handle) {
    evt.dataTransfer.dropEffect = "move";
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("dispElmIdx", dispElmIdx);
  } else {
    evt.preventDefault();
  }
}
function onDrop(evt, dropIdx) {
  const dragIdx = +evt.dataTransfer.getData("dispElmIdx");

  // nothing to move
  if (dropIdx == dragIdx) {
    return;
  }

  const dragElm = dispElements.value[dragIdx];
  const dropElm = dispElements.value[dropIdx];
  const dragElmPos = +dragElm.position;
  const dropElmPos = +dropElm.position;

  if (Math.abs(dropIdx - dragIdx) == 1) {
    // switch following items
    dragElm.position = dropElmPos;
    dropElm.position = dragElmPos;
  } else {
    // place the dragged item before the dropped item
    var prevElmPos = 0;
    if (dropIdx > 0) {
      prevElmPos = +dispElements.value[dropIdx - 1].position;
    }
    dragElm.position = (dropElmPos - prevElmPos) / 2 + prevElmPos;
  }
}
</script>

<style scoped></style>

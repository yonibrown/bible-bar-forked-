<template>
  <div>
    <section>
      <base-card>
        <h2>Project {{ project.id }}: {{ project.attr.name }}</h2>
      </base-card>
      <div
        v-for="(elm, dispElmIdx) in dispElements"
        :key="elm.id"
        :draggable="dragAllowed"
        @dragstart="startDrag($event, dispElmIdx)"
        @mousedown="startMouse($event)"
        @mouseup="onMouseup"
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
import { reactive, provide, computed, ref ,watch} from "vue";

const project = reactive({
  id: 1,
  attr: {
    name: "---",
    desc: "",
  }
});

const projectId = computed(function () {
  return { proj: project.id };
});
provide("projectId", projectId);

// elements
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

//links
const links = ref([]);
provide('links',links);

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
  links.value = obj.data.links;
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
}

// drag and drop
const dragAllowed = ref(false);

function startMouse(evt) {
  if (evt.target.closest(".element-head")) {
    dragAllowed.value = true;
  }
}

// window.addEventListener("mouseup", function () {
//   dragAllowed.value = false;
// });
function onMouseup(){
  dragAllowed.value = false;
}

function startDrag(evt, dispElmIdx) {
  dragAllowed.value = false;
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("dispElmIdx", dispElmIdx);
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
  saveElmList();
}

async function saveElmList(){
  const elmList = dispElements.value.map(function(elm,idx) {
    return {
      id: elm.id,
      disp: elm.disp.gs_disp,
      position: idx+1
    }
  });

  const data = {
    type: "project",
    oper: "save_elements",
    id: projectId.value,
    prop: {
      elements: elmList
    },
  };
  const obj = await sendToServer(data);
}

// link methods
function getLink(linkId) {
  const link = links.value.find((pLink) => {
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

function unlinkElement(link,element){
  link.elements = link.elements.filter(function(elmId){
    return elmId != element.id;
  });
}
provide('unlinkElement',unlinkElement);
// watch(links,function(){
//   console.log('links',links);
// },{
//     deep: true,
//   });


function closeElement(elm) {
  elm.position = 0;
  saveElmList();
}
</script>

<style scoped></style>

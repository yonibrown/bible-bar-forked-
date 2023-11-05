<template>
  <div>
    <section>
      <base-card>
        <div>
          <div class="title">
            Project {{ project.id }}: {{ project.attr.name }}
          </div>
          <span class="menu-buttons">
            <!-- <menu-button type="reload" @click="reloadElement"></menu-button> -->
            <menu-button type="add" @click="openNewElement"></menu-button>
            <menu-button type="close"></menu-button>
          </span>
        </div>
      </base-card>
      <base-draggable
        v-for="(elm, dispElmIdx) in dispElements"
        :key="elm.id"
        :data="dragData(dispElmIdx)"
      >
        <base-droppable
          :data="dispElmIdx"
          :drop="moveElement"
          :dragStruct="['dispElmIdx']"
        >
          <element-box
            :element="elm"
            @closeElement="closeElement(elm)"
          ></element-box>
        </base-droppable>
      </base-draggable>
    </section>
  </div>
</template>

<script setup>
import MenuButton from "../ui/MenuButton.vue";
import ElementBox from "./ElementBox.vue";
import { sendToServer } from "../../server.js";
import { reactive, provide, computed, ref,onUpdated } from "vue";

const project = reactive({
  id: 1,
  attr: {
    name: "---",
    desc: "",
  },
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
      return +a.position >= 0;
    })
    .sort(function (a, b) {
      return a.position - b.position;
    });
});

//links
const links = ref([]);
provide("links", links);

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
async function createElement(attr,options) {
  const data = {
    type: "element",
    oper: "new",
    id: { dummy: "" },
    prop: {
      proj: project.id,
      ...attr,
    },
  };
  const obj = await sendToServer(data);

  console.log(obj.data);
  if (options && options.openingElement){
    const elm = options.openingElement;
    if (elm.type == 'new'){
      elm.type = attr.type;
      elm.id = obj.data.id;
      elm.attr = obj.data.attr;
    }
  }
}
provide("createElement", createElement);

var tempElementId = -1;
function openNewElement() {
  elements.value.push({
    id: tempElementId--,
    position: elementPrevPos(0),
    type: "new",
    name: "new element",
  });
  console.log(elements.value);
}

// drag and drop elements
function dragData(dispElmIdx) {
  const data = { dispElmIdx };
  const elm = dispElements.value[dispElmIdx];
  if (elm.type == "link") {
    data.linkId = elm.attr.link_id;
  }
  return data;
}

function moveElement(dragData, dropIdx) {
  const dragIdx = +dragData.dispElmIdx;

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
    dragElm.position = elementPrevPos(dropIdx);
  }
  saveElmList();
}

const positionVersion = ref(0);
provide("positionVersion",positionVersion);
onUpdated(function(){
  positionVersion.value++;
  console.log('positionVersion',positionVersion.value);
});

function elementPrevPos(elmIdx) {
  const elm = dispElements.value[elmIdx];
  const elmPos = +elm.position;
  var prevElmPos = 0;
  if (elmIdx > 0) {
    prevElmPos = +dispElements.value[elmIdx - 1].position;
  }
  return (elmPos - prevElmPos) / 2 + prevElmPos;
}

async function saveElmList() {
  const elmList = dispElements.value.map(function (elm, idx) {
    return {
      id: elm.id,
      position: idx + 1,
    };
  });

  const data = {
    type: "project",
    oper: "save_elements",
    id: projectId.value,
    prop: {
      elements: elmList,
    },
  };
  const obj = await sendToServer(data);
}

function closeElement(elm) {
  elm.position = -1;
  saveElmList();
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

async function unlinkElement(link, elementId) {
  link.elements = link.elements.filter(function (arrElmId) {
    return arrElmId != elementId;
  });

  const data = {
    type: "link",
    oper: "remove_elm",
    id: {
      proj: project.id,
      link: link.id,
    },
    prop: { elm: elementId },
  };
  const obj = await sendToServer(data);
}
provide("unlinkElement", unlinkElement);

async function linkElement(link, elementId) {
  if (!link.elements.includes(elementId)) {
    link.elements.push(elementId);
  }

  const data = {
    type: "link",
    oper: "add_elm",
    id: {
      proj: project.id,
      link: link.id,
    },
    prop: { elm: elementId },
  };
  const obj = await sendToServer(data);
}
provide("linkElement", linkElement);

// watch(links,function(){
//   console.log('links',links);
// },{
//     deep: true,
//   });
</script>

<style scoped>
.menu-buttons {
  float: left;
}
.title {
  cursor: default;
  float: right;
  font-weight: bold;
  font-size: 1.5em;
  margin: 0.83em 0;
}
</style>

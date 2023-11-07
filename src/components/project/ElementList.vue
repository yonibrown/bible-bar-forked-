<template>
  <sortable-cell
    v-for="(elm, dispElmIdx) in dispElements"
    :key="elm.id"
    :idx="dispElmIdx"
    :dragData="dragData"
    :moveElement="moveElement"
    :dragStruct="['dispElmIdx']"
  >
    <element-box :element="elm" @closeElement="closeElement(elm)"></element-box>
  </sortable-cell>
</template>

<script setup>
import ElementBox from "./ElementBox.vue";
import SortableCell from "../ui/SortableCell.vue";
import { sendToServer } from "../../server.js";
import { provide, computed, ref, onUpdated ,inject} from "vue";

const props = defineProps(["elements"]);

const projectId = inject("projectId");

const dispElements = computed(function () {
  return props.elements
    .filter(function (a) {
      return +a.position >= 0;
    })
    .sort(function (a, b) {
      return a.position - b.position;
    });
});

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
provide("positionVersion", positionVersion);
onUpdated(function () {
  positionVersion.value++;
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

var tempElementId = -1;
function openNewElement() {
  props.elements.push({
    id: tempElementId--,
    position: elementPrevPos(0),
    type: "new",
    name: "new element",
  });
}
defineExpose({openNewElement});
</script>
<template>
  <sortable-cell
    v-for="(elm, dispElmIdx) in dispElements"
    :key="elm.id"
    :idx="dispElmIdx"
    :dragData="dragData"
    :moveElement="moveElement"
    :dragStruct="dragStruct"
  >
    <element-box
      :element="elm"
      @closeElement="closeElement(elm)"
      :nextPos="elementNextPos(dispElmIdx)"
    ></element-box>
  </sortable-cell>
</template>

<script setup>
import ElementBox from "./ElementBox.vue";
import { provide, computed, ref, onUpdated, inject } from "vue";

const props = defineProps(["elements", "tab"]);
const project = inject("project");

const dispElements = computed(function () {
  return props.elements
    .filter(function (a) {
      return +a.position >= 0 && a.tab == props.tab;
    })
    .sort(function (a, b) {
      return a.position - b.position;
    });
});

const dragStruct = ["dispElmId", "dispElmIdx", "dispElmTab"];
function dragData(dispElmIdx) {
  const elm = dispElements.value[dispElmIdx];

  const data = {
    dispElmId: elm.id,
    dispElmIdx,
    dispElmTab: props.tab,
  };

  if (elm.type == "link") {
    data.linkId = elm.attr.link_id;
  }
  if (elm.type == "parts") {
    data.resId = elm.attr.res;
  }
  return data;
}

function moveElement(dragData, dropIdx) {
  const dragIdx = +dragData.dispElmIdx;
  const dragTab = +dragData.dispElmTab;
  const dragId = +dragData.dispElmId;

  const dropTab = props.tab;

  const dropElm = dispElements.value[dropIdx];
  const dropElmPos = +dropElm.position;

  const dragElm = project.value.getElement(dragId);
  const dragElmPos = +dragElm.position;

  if (dropTab == dragTab) {
    // same tab
    if (dropIdx == dragIdx) {
      // nothing to move
      return;
    }

    if (Math.abs(dropIdx - dragIdx) == 1) {
      // switch following items
      dragElm.position = dropElmPos;
      dropElm.position = dragElmPos;
      saveElmList();
      return;
    }
  }

  dragElm.position = elementPrevPos(dropIdx);
  dragElm.tab = dropTab;
  saveElmList();
}

const positionVersion = ref(0);
provide("positionVersion", positionVersion);
onUpdated(function () {
  positionVersion.value++;
});

function elementPrevPos(elmIdx) {
  if (dispElements.value.length == 0) {
    return 1;
  }
  const elm = dispElements.value[elmIdx];
  const elmPos = +elm.position;
  var prevElmPos = 0;
  if (elmIdx > 0) {
    prevElmPos = +dispElements.value[elmIdx - 1].position;
  }
  return (elmPos - prevElmPos) / 2 + prevElmPos;
}

function elementNextPos(elmIdx) {
  const elm = dispElements.value[elmIdx];
  const elmPos = +elm.position;
  var nextElmPos = elmPos + 2;
  if (elmIdx < dispElements.value.length - 1) {
    nextElmPos = +dispElements.value[elmIdx + 1].position;
  }
  return (nextElmPos - elmPos) / 2 + elmPos;
}

function saveElmList() {
  const elmList = dispElements.value.map(function (elm, idx) {
    return {
      id: elm.id,
      position: idx + 1,
    };
  });
  project.value.storeElementList({
    elements: elmList,
    tab: props.tab,
  });
}

function closeElement(elm) {
  elm.position = -1;
  saveElmList();
}

function openNewElement() {
  project.value.openNewElement(props.tab,elementPrevPos(0));
}
defineExpose({ openNewElement });
</script>

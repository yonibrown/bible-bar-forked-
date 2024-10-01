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
      :nextPos="posElements.nextPos(dispElmIdx)"
    ></element-box>
  </sortable-cell>
</template>

<script setup>
import ElementBox from "./ElementBox.vue";
import { positioning } from "../../general.js";
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

const posElements = new positioning({
  elements: dispElements,
  saveElmList,
});
console.log("posElements", posElements._attr);

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
  posElements.move(
    {
      tab: +dragData.dispElmTab,
      idx: +dragData.dispElmIdx,
    },
    {
      tab: props.tab,
      idx: dropIdx,
    }
  );
}

const positionVersion = ref(0);
provide("positionVersion", positionVersion);
onUpdated(function () {
  positionVersion.value++;
});

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
  project.value.openNewElement(props.tab, posElements.prevPos(0));
}
defineExpose({ openNewElement });
</script>

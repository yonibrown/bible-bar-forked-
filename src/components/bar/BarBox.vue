<template>
  <div v-show="editMode">
    <sequence-menu
      v-show="editMode"
      :displayScale="true"
      :enableWholeText="true"
    ></sequence-menu>
    <links-menu title="הדגשות"></links-menu>
    <bar-menu ref="barMenuRef"></bar-menu>
  </div>
  <div class="in_body" ref="barBodyRef">
    <div class="bar_header">
      <div class="bar_area">
        <bar-sgm-header
          v-for="sgm in segments"
          :key="sgm.div"
          :segment="sgm"
        ></bar-sgm-header>
      </div>
    </div>
    <div class="bar_body">
      <div class="bar_area">
        <bar-segment
          v-for="sgm in segments"
          :key="sgm.div"
          :segment="sgm"
        ></bar-segment>
      </div>
      <div class="bar_area">
        <bar-link-points
          v-for="link in links"
          :key="link.id"
          :linkId="link.id"
          :points="points"
        ></bar-link-points>
      </div>
    </div>
  </div>
</template>

<script setup>
import BarMenu from "./BarMenu.vue";
import LinksMenu from "../link/LinksMenu.vue";
import SequenceMenu from "../sequence/SequenceMenu.vue";
import BarSgmHeader from "./BarSgmHeader.vue";
import BarSegment from "./BarSegment.vue";
import BarLinkPoints from "./BarLinkPoints.vue";
import { writeToClipboard } from "../../general.js";
import { inject, computed, provide, ref } from "vue";

const editMode = inject("editMode");
const element = inject("element");
const links = inject("links");

const barMenuRef = ref();
const barBodyRef = ref();

const segments = computed(function () {
  if (!element.value || !element.value.segments) {
    return [];
  }
  return element.value.segments;
});
const points = computed(function () {
  if (!element.value || !element.value.points) {
    return [];
  }
  return element.value.points;
});

element.value.reload();

const elmOpenText = inject("openText");
function openText(prop) {
  elmOpenText(prop, barMenuRef.value.openInSameElement);
}
provide("openText", openText);

function copyToClipboard() {
  writeToClipboard(barBodyRef.value, "png");
}

defineExpose({ copyToClipboard });
</script>

<style scoped>
.in_body {
  margin: 15px;
}

.in_body * {
  box-sizing: content-box;
}

/* bar */

.bar_header {
  /* float: right; */
  width: calc(100% - 4px);
  height: 15px;
  border-style: solid;
  border-color: transparent;
  border-width: 2px;
  position: relative;
  font-size: small;
}

.bar_body {
  position: relative;
  /* float: right; */
  width: calc(100% - 4px);
  height: 30px;
  background-color: grey;
  border-style: solid;
  border-color: darkslategray;
  border-width: 2px;
}

.bar_area {
  width: 100%;
  position: absolute;
}

.bar_body div {
  height: 30px;
}

.bar_header *,
.bar_body * {
  user-select: none;
}
</style>

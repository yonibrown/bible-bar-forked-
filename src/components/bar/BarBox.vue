<template>
  <!-- <h3>Bar</h3> -->
  <div class="in_body">
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
import BarSgmHeader from "./BarSgmHeader.vue";
import BarSegment from "./BarSegment.vue";
import BarLinkPoints from "./BarLinkPoints.vue";
import { sendToServer } from "../../server.js";

import { inject, watch, ref, computed } from "vue";

const elementId = inject("elementId");
const hasToReload = inject("hasToReload");
const reloaded = inject("reloaded");
const links = inject("links");

const segments = ref([]);
const points = ref([]);

// const barActiveLinks = ref(
//   links.value.map(function (link) {
//     return link.id;
//   })
// );

// watch(links,function(newVal){
//   const linkIds = newVal.map(function(link){
//     return link.id;
//   });

//   linkIds.find(function(linkId){
//     return
//   });

// });

watch(hasToReload, function (newVal) {
  if (newVal) {
    // clear points so they don't interfere
    points.value = [];

    loadElmBarSegments();
    loadElmBarPoints();

    reloaded();
  }
});

loadElmBarSegments();
loadElmBarPoints();

async function loadElmBarSegments() {
  const data = {
    type: "element",
    oper: "get_segments",
    id: elementId.value,
    prop: { dummy: "" },
  };

  const obj = await sendToServer(data);

  segments.value = obj.data.segments;
}

async function loadElmBarPoints() {
  const data = {
    type: "element",
    oper: "get_points",
    id: elementId.value,
    prop: { dummy: "" },
  };

  const obj = await sendToServer(data);

  points.value = obj.data.points;
}
</script>

<style scoped>
.in_body {
  margin: 15px;
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

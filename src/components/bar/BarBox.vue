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
        <bar-point v-for="pt in points" :key="pt.id" :point="pt"></bar-point>
      </div>
    </div>
  </div>
</template>

<script setup>
import BarSgmHeader from './BarSgmHeader.vue';
import BarSegment from './BarSegment.vue';
import BarPoint from './BarPoint.vue';
import { sendToServer } from '../../server.js';

import { computed, inject, watch } from 'vue';

const props = defineProps(['element']);
const elementId = inject('elementId');
const updateElement = inject('updateElement');
const hasToReload = inject('hasToReload');
const reloaded = inject('reloaded');

const segments = computed(function () {
  return props.element.segments;
});
const points = computed(function () {
  return props.element.points;
});

watch(hasToReload, function (newVal) {
  if (newVal) {
    // clear points so they don't interfere
    updateElement({
      points: [],
      // segments: []
    });

    loadElmBarSegments();
    loadElmBarPoints();

    reloaded();
  }
});

loadElmBarSegments();
loadElmBarPoints();

async function loadElmBarSegments() {
  const data = {
    type: 'element',
    oper: 'get_segments',
    id: elementId.value,
    prop: { dummy: '' },
  };

  const obj = await sendToServer(data);

  updateElement({
    segments: obj.data.segments,
  });
}

async function loadElmBarPoints() {
  const data = {
    type: 'element',
    oper: 'get_points',
    id: elementId.value,
    prop: { dummy: '' },
  };

  const obj = await sendToServer(data);

  updateElement({
    points: obj.data.points,
  });
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

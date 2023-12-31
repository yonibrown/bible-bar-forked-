<template>
  <div
    v-if="category"
    class="bar_point"
    :style="{
      right: point.position,
      width: point.width,
      backgroundColor: category.color,
    }"
    v-show="category.display"
    @dblclick="openText"
  >
    <span class="bar_tooltip">{{ tooltip }}</span>
  </div>
</template>

<script setup>
const props = defineProps(["point"]);
import { computed, inject } from "vue";
import { biLink } from "../../store/biLink.js";

const barOpenText = inject("openText");

const category = computed(() => {
  return biLink.getCategory(props.point.link, props.point.col);
});
const tooltip = computed(() => {
  return props.point.verse.replaceAll(",", " ");
});

function openText() {
  barOpenText({
    type: "text",
    point_research_id: props.point.res,
    point_part_id: props.point.id,
  });
}
</script>

<style scoped>
.bar_point {
  position: absolute;
  min-width: 1px;
  height: inherit;
}

.bar_point:hover .bar_tooltip {
  visibility: visible;
  opacity: 1;
}

.bar_tooltip {
  visibility: hidden;
  width: 120px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}
</style>

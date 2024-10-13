<template>
  <span
    ref="elm"
    class="element"
    @mouseover="enterElement"
    @mouseleave="leaveElement"
  >
    <slot></slot>
    <Teleport to="body">
      <div
        ref="tooltip"
        class="tooltip"
        v-show="hoverElement"
        :style="tooltipStyle"
      >
        {{ text }}
      </div>
    </Teleport>
  </span>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps(["text"]);

const elm = ref();
const tooltip = ref();

const tooltipStyle = ref();

const hoverElement = ref(false);
function enterElement() {
  const rectElm = elm.value.getBoundingClientRect();
  const rectTlp = tooltip.value.getBoundingClientRect();
  tooltipStyle.value = {
    top: rectElm.y - 35 + "px",
    left: rectElm.x + rectElm.width / 2 - rectTlp.width / 2 + "px",
  };
  hoverElement.value = true;
}
function leaveElement() {
  // hoverElement.value = false;
}
</script>

<style scoped>
.tooltip {
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 3px 10px;
  position: absolute;
  z-index: 1;
  /* width: 120px; */
  margin-left: -60px;
  opacity: 1;
  transition: opacity 0.3s;
}
</style>

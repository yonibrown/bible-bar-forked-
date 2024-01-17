<template>
  <span>
    <span v-for="(word, idx) in words">
      <base-draggable>
        <span class="divider draggable-head" v-show="idx == 0">|</span>
      </base-draggable>
      <base-droppable
        :drop="setDivider"
        :dragStruct="['wordIdx']"
        :dragEnter="enterWord"
        :dragLeave="leaveWord"
      >
        <span>{{ word }}</span>
      </base-droppable>
    </span>
  </span>
</template>

<script setup>
import WordInRange from "./WordInRange.vue";
import { inject, computed, provide } from "vue";
const props = defineProps(["text", "fromWord", "toWord"]);

const words = computed(function () {
  return props.text
    .replaceAll(/[\s־׃]/g, (ch) => {
      return "x" + ch + "x";
    })
    .split("x");
});

const hilightMenu = ref(false);

function enterLinksMenu() {
  hilightMenu.value = true;
}
function leaveLinksMenu() {
  hilightMenu.value = false;
}
</script>

<style scoped>
.divider {
  color: blue;
  cursor: col-resize;
}
</style>

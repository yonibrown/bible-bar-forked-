<template>
  <base-droppable
    v-if="displayOptions"
    :drop="drop"
    :dragStruct="dragStruct"
    :dragEnter="enterLinksMenu"
    :dragLeave="leaveLinksMenu"
  >
    <div :class="{ 'edit-table': displayOptions, 'edit-hilight': hilightMenu }">
      <slot></slot>
    </div>
  </base-droppable>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
const displayOptions = inject("displayOptions");

const props = defineProps(["drop", "dragStruct"]);

const hilightMenu = ref(false);

function enterLinksMenu() {
  hilightMenu.value = true;
}
function leaveLinksMenu() {
  hilightMenu.value = false;
}
</script>

<style scoped>
.edit-table {
  min-height: 40px;
  border: dashed lightgray;
  position: relative;
}
.edit-hilight {
  background-color: rgb(255, 253, 238);
}
.edit-board {
  min-height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  opacity: 0.5;
  background-color: rgb(255, 253, 238);
}
</style>

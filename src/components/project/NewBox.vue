<template>
  <base-menu>
    <span>פעולה</span>
    <select v-model="action">
      <option value="new">חדש</option>
      <option value="open">פתח</option>
    </select>
    <span>סוג:</span>
    <select v-model="type">
      <option value="choose">בחר</option>
      <option
        v-for="typ in typeList"
        :value="typ.id"
        v-show="typ.openList || action == 'new'"
      >
        {{ typ.name }}
      </option>
    </select>
    <select v-if="displayResearchList" v-model="selectedObject">
      <option value="choose">בחר</option>
      <option v-for="res in researches" :value="res.id">{{ res.name }}</option>
    </select>
    <input
      type="submit"
      value="פתח"
      @click="submitElement"
      :disabled="!displaySubmitElement"
    />
  </base-menu>
</template>

<script setup>
import { ref, computed, inject, watch } from "vue";

const action = ref("new");
const type = ref("choose");
const selectedObject = ref("choose");

const typeList = [
  {
    id: "bar",
    name: "ציר",
    openList: false,
  },
  {
    id: "text",
    name: "טקסט",
    openList: false,
  },
  {
    id: "parts",
    name: "רשימה",
    openList: true,
  },
  {
    id: "note",
    name: "הערות",
    openList: false,
  },
];

watch(action, function () {
  type.value = "choose";
});

const displayResearchList = computed(function () {
  return action.value == "open" && type.value != "choose";
});

const displaySubmitElement = computed(function () {
  if (action.value == "new") {
    return type.value != "choose";
  }

  if (action.value == "open") {
    return type.value != "choose" && selectedObject.value != "choose";
  }
});

const researches = inject("researches");

const createElement = inject("createElement");
function submitElement() {
  if (action.value == "new") {
    createElement({
      type: type.value,
    });
    return;
  }
  if (action.value == "open") {
    console.log('not yet implemented');
    return;
  }
}
</script>

<style scoped>
div * {
  margin-left: 6px;
}
</style>

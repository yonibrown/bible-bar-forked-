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
    <select v-if="displayObjectList" v-model="selectedObject">
      <option value="choose">בחר</option>
      <option v-for="obj in objects" :value="obj.id">{{ obj.name }}</option>
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
    id: "link",
    name: "הדגשות",
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

const displayObjectList = computed(function () {
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
const links = inject("links");
const objects = computed(function () {
  if (type.value == "parts") {
    return researches.value;
  }
  if (type.value == "link") {
    return links.value;
  }
  return [];
});

const createElement = inject("createElement");
function submitElement() {
  if (action.value == "new") {
    createElement({
      type: type.value,
    });
    return;
  }
  if (action.value == "open") {
    if (type.value == "parts") {
      createElement({
        type: type.value,
        res: selectedObject.value,
      });
      return;
    }
    if (type.value == "link") {
      createElement({
        type: type.value,
        link: selectedObject.value,
      });
      return;
    }
    console.log("not yet implemented");
    return;
  }
}
</script>

<style scoped>
div * {
  margin-left: 6px;
}
</style>

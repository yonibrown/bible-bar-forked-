<template>
  <base-menu>
    <span>פעולה:</span>
    <select v-model="action">
      <option value="choose">בחר...</option>
      <option value="changeCat">העבר לקטגוריה</option>
      <option value="duplicate">העתק לרשימה חדשה</option>
      <option value="remove">מחק מהרשימה</option>
    </select>
    <span v-if="displayChangeCat">
      <span>קטגוריה:</span>
      <select v-model="moveToCat">
        <option value="0">בחר...</option>
        <option v-for="col in research.collections" :value="col.id">
          {{ col.name }}
        </option>
      </select>
    </span>
    <input
      v-if="displaySubmit"
      type="submit"
      value="החל"
      @click="submitChanges"
      :disabled="!hasChanges"
    />
  </base-menu>
</template>

<script setup>
import { ref, computed, inject } from "vue";

const emit = defineEmits(["updateData"]);

const elementAttr = inject("elementAttr");
const getResearch = inject("getResearch");

const action = ref("choose");
const displayChangeCat = computed(function () {
  return action.value == "changeCat";
});
const displaySubmit = computed(function () {
  return action.value != "choose";
});

const research = getResearch(elementAttr.value.res);

const moveToCat = ref(0);
const hasChanges = computed(function () {
  if (action.value == "changeCat"){
    return moveToCat.value != 0;
  }
  return action.value != "choose";
});

function submitChanges() {
  let act, prop;
  switch (action.value) {
    case "changeCat":
      act = "moveSelectedToCat";
      prop = moveToCat.value;
      break;
    case "duplicate":
      act = "duplicate";
      prop = { dummy: "" };
      break;
  }
  emit("updateData", {
    action: act,
    newCat: prop,
  });
}
</script>

<style scoped>
div * {
  margin-left: 6px;
}
</style>

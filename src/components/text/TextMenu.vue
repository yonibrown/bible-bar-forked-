<template>
  <base-menu>
    <span>פעולה:</span>
    <select v-model="action">
      <option value="choose">בחר...</option>
      <option value="changeCat">הוסף לקטגוריה</option>
    </select>
    <span v-if="displayChangeCat">
      <span>קטגוריה:</span>
      <select v-model="moveToCat">
        <option value="0">בחר...</option>
        <text-col-option
          v-for="(col, idx) in collections"
          :col="col"
          :key="idx"
        ></text-col-option>
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
import TextColOption from "./TextColOption.vue";

const emit = defineEmits(["updateData"]);

const collections = inject("collections");
console.log(collections);

const action = ref("choose");
const displayChangeCat = computed(function () {
  return action.value == "changeCat";
});
const displaySubmit = computed(function () {
  return action.value != "choose";
});

const moveToCat = ref(0);
const hasChanges = computed(function () {
  if (action.value == "changeCat") {
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

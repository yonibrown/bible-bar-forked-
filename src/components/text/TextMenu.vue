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
        <optgroup v-for="res in researches" :label="res.name">
          <option :value="col.id" v-for="col in res.collections">
            {{ col.name }}
          </option>
        </optgroup>
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

const researches = inject("researches");

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

<template>
  <base-menu>
    <span>פעולה:</span>
    <select v-model="action">
      <option value="choose">בחר...</option>
      <option value="addToCat">הוסף לרשימה</option>
    </select>
    <span v-if="displayChangeCat">
      <span>קטגוריה:</span>
      <select v-model="moveToCat">
        <option value="0">בחר...</option>
        <optgroup v-for="res in researches" :label="res.name">
          <option :value="res.id + '-' + col.id" v-for="col in res.collections">
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
  return action.value == "addToCat";
});
const displaySubmit = computed(function () {
  return action.value != "choose";
});

const moveToCat = ref(0);
const hasChanges = computed(function () {
  if (action.value == "addToCat") {
    return moveToCat.value != 0;
  }
  return action.value != "choose";
});

function submitChanges() {
  let prop;
  switch (action.value) {
    case "addToCat":
      let catArr = moveToCat.value.split("-");
      prop = {
        research_id: catArr[0],
        collection_id: catArr[1],
      };
      break;
  }
  emit("updateData", {
    action: action.value,
    prop,
  });
}
</script>

<style scoped>
div * {
  margin-left: 6px;
}
</style>

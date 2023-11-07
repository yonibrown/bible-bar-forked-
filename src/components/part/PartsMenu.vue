<template>
  <base-menu>
    <span>פעולה:</span>
    <select v-model="action">
      <option value="choose">בחר...</option>
      <option value="changeCat">העבר לקטגוריה</option>
    </select>
    <span v-if="displayChangeCat">
      <span>קטגוריה:</span>
      <select v-model="moveToCat">
        <option value="0">בחר...</option>
        <option v-for="col in research.collections" :value="col.id">
          {{ col.name }}
        </option>
      </select>
      <input
        type="submit"
        value="החל"
        @click="submitChanges"
        :disabled="!hasChanges || !linesSelected"
      />
    </span>
  </base-menu>
</template>

<script setup>
import { ref, computed, inject } from "vue";

const emit = defineEmits(["updateData"]);

const elementAttr = inject("elementAttr");
const linesSelected = inject("linesSelected");
const getResearch = inject("getResearch");

const action = ref("choose");
const displayChangeCat = computed(function () {
  return action.value == "changeCat";
});

const research = getResearch(elementAttr.value.res);

const moveToCat = ref(0);
const hasChanges = computed(function () {
  return moveToCat.value != 0;
});

function submitChanges() {
  emit("updateData", {
    action: "moveSelectedToCat",
    newCat: moveToCat.value,
  });
}
</script>

<style scoped>
div * {
  margin-left: 6px;
}
</style>

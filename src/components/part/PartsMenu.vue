<template>
  <base-menu>
    <span>פעולה:</span>
    <select v-model="action">
      <option value="choose">בחר...</option>
      <option value="newCat">קטגוריה חדשה</option>
      <option value="changeCat">העבר לקטגוריה</option>
      <option value="duplicate">העתק לרשימה חדשה</option>
      <option value="remove">מחק מהרשימה</option>
    </select>
    <span v-if="displayCatList">
      <span>קטגוריה:</span>
      <select v-model="moveToCat">
        <option value="choose">בחר...</option>
        <option value="new">קטגוריה חדשה</option>
        <option disabled value="">---------</option>
        <option v-for="col in research.collections" :value="col.id">
          {{ col.name }}
        </option>
      </select>
    </span>
    <span v-if="displayNewCat">
      <span>שם:</span>
      <input
        type="text"
        id="newName"
        name="category"
        v-model.trim="newCategory"
      />
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

const research = inject("research");

const action = ref("choose");
const displayCatList = computed(function () {
  return action.value == "changeCat";
});
const displaySubmit = computed(function () {
  return action.value != "choose";
});

const moveToCat = ref("choose");
const displayNewCat = computed(function () {
  return (
    (displayCatList && moveToCat.value == "new") || action.value == "newCat"
  );
});

const newCategory = ref("");
const hasChanges = computed(function () {
  if (displayCatList.value) {
    if (moveToCat.value == "new") {
      return newCategory.value != "";
    }
    return moveToCat.value != "choose";
  }
  return action.value != "choose";
});

function submitChanges() {
  let act, prop;
  switch (action.value) {
    case "newCat":
      act = "newCat";
      prop = {
        collection_id: 0,
        collection_name: newCategory.value,
      };
      break;
    case "changeCat":
      act = "moveSelectedToCat";
      if (moveToCat.value == "new") {
        prop = {
          collection_id: 0,
          collection_name: newCategory.value,
        };
      } else {
        prop = { collection_id: moveToCat.value };
      }
      break;
    case "duplicate":
      act = "duplicate";
      prop = { dummy: "" };
      break;
  }
  emit("updateData", {
    action: act,
    prop,
  });
}
</script>

<style scoped>
div * {
  margin-left: 6px;
}
</style>

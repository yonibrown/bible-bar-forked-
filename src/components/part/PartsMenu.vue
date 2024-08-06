<template>
  <base-menu>
    <span>פעולה:</span>
    <select v-model="action">
      <option value="choose">בחר...</option>
      <option value="newCat">קטגוריה חדשה</option>
      <option value="changeCat" v-show="currentTab == 'parts'">
        העבר לקטגוריה
      </option>
      <option value="duplicate" v-show="currentTab == 'parts'">
        העתק לרשימה חדשה
      </option>
      <option value="remove">מחק מהרשימה</option>
      <option value="upload">טען נתונים מקובץ</option>
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
    <input type="file" v-if="displayUploadFile" ref="fileRef" />
    <!-- <label id="file-input-label" for="file-input"
      >Select a File</label> 
    example in https://bobbyhadz.com/blog/change-or-remove-no-file-chosen-input-type-file-in-html
    -->
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
    <span class="divider">|</span>
    <span>תצוגת רשימה:</span>
    <select v-model="listMode">
      <option value="verse">פסוק אחד</option>
      <option value="segment">מקטע</option>
    </select>
    <span class="divider">|</span>
    <input type="checkbox" v-model="openInSameElement" />
    <span>פתח טקסט בחלון קבוע</span>
  </base-menu>
</template>

<script setup>
import { ref, computed, inject } from "vue";

const props = defineProps(["currentTab"]);
const emit = defineEmits(["updateData"]);

const research = inject("research");

const openInSameElement = ref(true);
const fileRef = ref();

const action = ref("choose");
const displayCatList = computed(function () {
  return action.value == "changeCat";
});
const displayUploadFile = computed(function () {
  return action.value == "upload";
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
  // if (displayUploadFile.value) {
  //   return fileRef.value && fileRef.value.files.length > 0;
  // }
  return action.value != "choose";
});

const listMode = ref("segment");

function submitChanges() {
  let prop = { dummy: "" };
  switch (action.value) {
    case "newCat":
      prop = {
        collection_id: 0,
        collection_name: newCategory.value,
      };
      break;
    case "changeCat":
      if (moveToCat.value == "new") {
        prop = {
          collection_id: 0,
          collection_name: newCategory.value,
        };
      } else {
        prop = { collection_id: moveToCat.value };
      }
      break;
    case "upload":
      if (fileRef.value.files.length == 0) {
        return;
      }
      prop = {
        file: fileRef.value.files[0],
      };
      break;
  }
  emit("updateData", {
    action: action.value,
    prop,
  });
}
defineExpose({ openInSameElement, listMode });
</script>

<style scoped>
div * {
  margin-left: 6px;
}

.divider {
  color: gray;
  font-size: 1.1rem;
}
</style>

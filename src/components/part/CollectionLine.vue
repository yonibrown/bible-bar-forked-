<template>
  <base-editable
    v-if="field.name == 'name'"
    :initialValue="name"
    @submitValue="submitName"
    name="collectionName"
    :defaultValue="defaultName"
    :disabled="!enableSelection"
    placeholder="הוסף קטגוריה..."
  ></base-editable>
  <base-editable
    v-else-if="field.name == 'description'"
    :initialValue="description"
    @submitValue="submitDesc"
    name="collectionDescription"
    :blankable="true"
    :disabled="!enableSelection"
    placeholder="הוסף תיאור..."
  ></base-editable>
  <span v-else></span>
</template>

<script setup>
import { inject, computed, ref } from "vue";

const props = defineProps(["line", "field", "enableSelection", "newLineAttr","useAttr"]);
const emit = defineEmits(["addAttr"]);
const research = inject("research");
const updateCollection = inject("updateCollection");
const newCollection = inject("newCollection");

const defaultName = computed(function () {
  if (props.line.newLine) {
    return "קטגוריה חדשה";
  }
  return "קטגוריה " + props.line.id;
});

const name = computed(function () {
  if (props.line.newLine) {
    return "";
  }
  return props.line.name;
});

const description = computed(function () {
  if (props.line.newLine) {
    if (props.newLineAttr.description){
      return props.newLineAttr.description;
    }
    return '';
  }
  return props.line.description;
});

function submitName(newVal) {
  const newAttr = { name: newVal };
  if (props.line.newLine) {
    Object.assign(newAttr,props.useAttr());
    newCollection(research, newAttr);
  } else {
    updateCollection(props.line, newAttr);
  }
}

function submitDesc(newVal) {
  const newAttr = { description: newVal };
  if (props.line.newLine) {
    emit("addAttr", { description: newVal });
  } else {
    updateCollection(props.line, newAttr);
  }
}
</script>

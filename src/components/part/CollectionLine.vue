<template>
  <spec-line>
    <template #name>
      <base-editable
        :initialValue="name"
        @submitValue="submitName"
        name="collectionName"
        :getDefault="defaultName"
        :disabled="!enableSelection"
        placeholder="הוסף קטגוריה..."
      ></base-editable>
    </template>
    <template #description>
      <base-editable
        :initialValue="description"
        @submitValue="submitDesc"
        name="collectionDescription"
        :blankable="true"
        :disabled="!enableSelection"
        placeholder="הוסף תיאור..."
      ></base-editable>
    </template>
  </spec-line>
</template>

<script setup>
import { inject, computed, ref } from "vue";

const props = defineProps(["line"]);
const emit = defineEmits(["addAttr"]);
const research = inject("research");
const enableSelection = inject("enableSelection");

function defaultName() {
  if (props.line.newLine) {
    return "קטגוריה חדשה";
  }
  return "קטגוריה " + props.line.id;
}

const emptyAttr = {
  name: "",
  description: "",
};
const attr = ref({ ...emptyAttr });

const name = computed(function () {
  if (props.line.newLine) {
    return attr.value.name;
  }
  return props.line.name;
});

const description = computed(function () {
  if (props.line.newLine) {
    return attr.value.description;
  }
  return props.line.description;
});

function submitName(newVal) {
  const newAttr = { name: newVal };
  if (props.line.newLine) {
    research.value.newCollection({
      ...attr.value,
      ...newAttr,
    });
    attr.value = { ...emptyAttr };
  } else {
    props.line.changeAttr(newAttr);
  }
}

function submitDesc(newVal) {
  const newAttr = { description: newVal };
  if (props.line.newLine) {
    Object.assign(attr.value, newAttr);
  } else {
    props.line.changeAttr(newAttr);
  }
}
</script>

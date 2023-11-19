<template>
  <!-- <span v-if="field.name == 'name'">{{ line.name }}</span> -->
  <base-editable
    v-if="field.name == 'name'"
    :initialValue="line.name"
    @submitValue="submitName"
    name="collectionName"
    :defaultValue="'קטגוריה'+line.id"
    :disabled="!enableSelection"
  ></base-editable>
  <base-editable
    v-else-if="field.name == 'description'"
    :initialValue="line.description"
    @submitValue="submitDesc"
    name="collectionDescription"
    :blankable="true"
    :disabled="!enableSelection"
    placeholder="הוסף תיאור..."
  ></base-editable>
  <span v-else></span>
</template>

<script setup>
import { inject } from "vue";

const props = defineProps(["line", "field", "enableSelection"]);
const updateCollection = inject("updateCollection");

function submitName(newVal) {
  // props.line.name = newVal;
  const newAttr = {name: newVal};
  updateCollection(props.line,newAttr);
}

function submitDesc(newVal) {
  const newAttr = {description: newVal};
  updateCollection(props.line,newAttr);
}
</script>

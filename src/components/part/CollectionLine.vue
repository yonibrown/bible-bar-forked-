<template>
  <!-- <span v-if="field.name == 'name'">{{ line.name }}</span> -->
  <base-editable
    v-if="field.name == 'name'"
    :initialValue="name"
    @submitValue="submitName"
    name="collectionName"
    :defaultValue="defaultName"
    :disabled="!enableSelection"
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
import { inject,computed } from "vue";

const props = defineProps(["line", "field", "enableSelection","newLine"]);
const updateCollection = inject("updateCollection");
console.log(props.line);

const defaultName = computed(function(){
  if (props.newLine){
    return 'קטגוריה חדשה';
  }
  return 'קטגוריה '+props.line.id;
});

const name = computed(function(){
  if (props.newLine){
    return '';
  }
  return props.line.name;
});

const description = computed(function(){
  if (props.newLine){
    return '';
  }
  return props.line.description;
});

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

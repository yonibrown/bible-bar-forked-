<template>
  <!-- <span v-if="field.name == 'name'">{{ line.name }}</span> -->
  <base-editable v-if="field.name == 'name'"
    :initialValue="line.name"
    @submitValue="submitName"
    name="collectionName"
    :defaultValue="'ק'"
    :disabled="!enableSelection"
  ></base-editable>
  <span v-else>
    {{ line.description }}
  </span>
</template>

<script setup>
const props = defineProps(["line", "field","enableSelection"]);

function submitName(){
  console.log('submit collection name');
}
</script>

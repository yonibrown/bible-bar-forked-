<template>
  <!-- <span v-if="field.name == 'name'">{{ line.name }}</span> -->
  <base-editable
    v-if="field.name == 'name'"
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
import { inject } from "vue";

const props = defineProps(["line", "field", "enableSelection"]);
const researchId = inject("researchId");
const updateCollection = inject("updateCollection");

function submitName(newVal) {
  const newAttr = {name: newVal};
  updateCollection(props.line,newAttr);
}

</script>

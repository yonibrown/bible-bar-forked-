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
import {  inject } from "vue";
import { sendToServer } from "../../server.js";

const props = defineProps(["line", "field","enableSelection"]);
const researchId = inject("researchId");

async function submitName(newVal) {
  props.line.name = newVal;
  const data = {
    type: "research",
    oper: "update_collection",
    id: researchId,
    prop: {
      col: props.line.id,
      name: newVal,
    },
  };

  const obj = await sendToServer(data);
}

</script>

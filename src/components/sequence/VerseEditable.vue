<template>
  <sequence-key
    :initialValue="initialKey"
    @changeValue="updateDiv"
    defaultValue="min"
  ></sequence-key>
</template>

<script setup>
import SequenceKey from "../sequence/SequenceKey.vue";

const props = defineProps(["initPosition", "initDivision", "initialKey"]);
const emit = defineEmits(["submitValue"]);

var changedAttr = {};

function updateDiv(newVal) {
  changedAttr["div"] = newVal.id;
  changedAttr["name"] = newVal.name;
}

defineExpose({ changedAttr });
</script>

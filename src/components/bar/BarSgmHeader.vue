<template>
  <div :style="{ width: segment.width }" @dblclick="selectDiv">
    {{ segment.name }}
  </div>
</template>

<script setup>
import { inject } from "vue";
const props = defineProps(["segment"]);
const changeAttr = inject("changeAttr");

function selectDiv() {
  changeAttr({ division_id: props.segment.div });
}
</script>

<style scoped>
div {
  /*    height: 100%;*/
  float: right;
}
</style>

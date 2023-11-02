<template>
  <bar-point v-for="pt in linkPoints" :key="pt.id" :point="pt"></bar-point>
</template>

<script setup>
import BarPoint from "./BarPoint.vue";
import { computed } from "vue";

const props = defineProps(["points","linkId"]);
const linkPoints = computed(function(){
    return props.points.filter(function(pt){
        return pt.link == props.linkId;
    });
});
</script>

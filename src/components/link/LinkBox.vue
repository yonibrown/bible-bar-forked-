<template>
  <edit-box :drop="addToLink" :dragStruct="['resId']">
    <div>
      <link-category
        v-for="cat in categories"
        :key="cat.id"
        :category="cat"
        @update-category="(data) => link.updateCategory(cat, data)"
      ></link-category>
    </div>
  </edit-box>
</template>

<script setup>
import LinkCategory from "./LinkCategory.vue";
import EditBox from "../ui/EditBox.vue";
import { computed, inject } from "vue";

const project = inject("project");
const elementAttr = inject("elementAttr");

const link = computed(function () {
  return project.value.getLink({ id: elementAttr.value.link_id });
});

const categories = computed(function () {
  return link.value.categories;
});

function addToLink(data) {
  link.value.addResearch(data.resId);
}
</script>

<style scoped>
.edit-table {
  min-height: 40px;
  border: dashed lightgray;
}
</style>

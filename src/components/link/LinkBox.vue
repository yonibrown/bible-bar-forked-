<template>
  <div>
    <table class="in_body">
      <link-category
        v-for="cat in categories"
        :key="cat.id"
        :category="cat"
        @update-category="(data) => updateCategory(linkId, cat, data)"
      ></link-category>
    </table>
  </div>
</template>

<script setup>
import LinkCategory from "./LinkCategory.vue";
import { computed, inject } from "vue";

const projectId = inject("projectId");
const getLink = inject("getLink");
const elementAttr = inject("elementAttr");
const updateCategory = inject("lnkUpdateCategory");

const linkId = computed(function () {
  return {
    proj: projectId.value.proj,
    link: elementAttr.value.link_id,
  };
});

const link = computed(function () {
  return getLink(linkId.value.link);
});

const categories = computed(function () {
  return link.value.categories;
});

</script>

<style scoped></style>

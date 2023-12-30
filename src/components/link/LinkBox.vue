<template>
  <div>
    <table class="in_body">
      <link-category
        v-for="cat in categories"
        :key="cat.id"
        :category="cat"
        @update-category="(data) => link.updateCategory( cat, data)"
      ></link-category>
    </table>
  </div>
</template>

<script setup>
import LinkCategory from "./LinkCategory.vue";
import { computed, inject } from "vue";

const project = inject("project");
const elementAttr = inject("elementAttr");

const link = computed(function () {
  return project.value.getLink({ id: elementAttr.value.link_id });
});

const categories = computed(function () {
  return link.value.categories;
});
</script>

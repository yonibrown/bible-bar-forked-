<template>
  <base-scrollable>
    <div class="links">
      <table>
        <link-category
          v-for="cat in categories"
          :key="cat.id"
          :category="cat"
          @update-category="(data) => link.updateCategory(cat, data)"
        ></link-category>
      </table>
    </div>
  </base-scrollable>
</template>

<script setup>
import LinkCategory from "../link/LinkCategory.vue";
import { computed, inject } from "vue";

const project = inject("project");
const research = inject("research");

const link = computed(function () {
  return project.value.getLink({ res: research.value.id });
});

const categories = computed(function () {
  if (!link.value) {
    return [];
  }
  return link.value.categories;
});
</script>

<style scoped>
.links {
  background-color: #e4e9f1;
  min-height: 100%;
  padding: 7px;
}
</style>

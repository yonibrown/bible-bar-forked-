<template>
  <!-- <h3>Markers</h3> -->
  <div>
    <table class="in_body">
      <link-category
        v-for="cat in categories"
        :key="cat.id"
        :category="cat"
        @update-category="(data) => updateCategory(cat, data)"
      ></link-category>
    </table>
  </div>
</template>

<script setup>
import LinkCategory from './LinkCategory.vue';
import { computed, inject } from 'vue';
import { sendToServer } from '../../server.js';

const props = defineProps(['element']);

const projectId = inject('projectId');
const getLink = inject('getLink');

const linkId = computed(function () {
  return props.element.attr.link_id;
});

const link = computed(function () {
  return getLink(linkId.value);
});

const categories = computed(function () {
  return link.value.categories;
});

// import link stuff
async function updateCategory(cat, attr) {
  // update browser
  Object.assign(cat, attr);

  // update server
  const data = {
    type: 'link',
    oper: 'upd_cat',
    id: {
      link: linkId.value,
      ...projectId.value,
    },
    prop: {
      cat_id: cat,
      cat_attr: attr,
    },
  };
  const obj = await sendToServer(data);
}
</script>

<style scoped></style>

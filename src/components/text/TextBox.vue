<template>
  <!-- <h3>Text</h3> -->
  <div class="win_text bible-text in_body">
    <text-verse
      v-for="vrs in verses"
      :key="vrs.part_id"
      :verse="vrs"
    ></text-verse>
  </div>
</template>

<script setup>
import TextVerse from './TextVerse.vue';
import { computed, inject } from 'vue';
import { sendToServer } from '../../server.js';

const props = defineProps(['element']);
const elementId = inject('elementId');
const updateElement = inject('updateElement');

const verses = computed(function () {
  return props.element.verses;
});

loadElmText();

async function loadElmText() {
  const data = {
    type: 'element',
    oper: 'get_segment',
    id: elementId.value,
    prop: { dummy: '' },
  };

  const obj = await sendToServer(data);

  updateElement({
    title: obj.data.title,
    verses: obj.data.part_list,
  });
}
</script>

<style scoped>
.win_text {
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 15px;
  border: 1px solid #9aaab9;
  background-color: white;
  text-align: justify;
}

.bible-text {
  font-family: David, sans-serif;
}

.in_body {
  margin: 15px auto;
}
</style>

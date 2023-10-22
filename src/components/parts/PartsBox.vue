<template>
  <!-- <h3>Parts</h3> -->
  <div>
    <table>
      <tr class="resprt-header">
        <td>קטגוריה</td>
        <td>פסוק</td>
        <td>טקסט</td>
      </tr>
      <parts-line
        class="resprt-part"
        v-for="prt in research.parts"
        :prt="prt"
        :key="prt.id"
      ></parts-line>
    </table>
  </div>
</template>

<script setup>
import { sendToServer } from '../../server.js';
import PartsLine from './PartsLine.vue';

import { reactive, inject } from 'vue';

const props = defineProps(['element']);
const getResearch = inject('getResearch');

const research = reactive(getResearch(props.element.attr.res));

const researches = inject('researches');

const researchId = { res: props.element.attr.res };

function updateResearch(data) {
  Object.assign(research, data);
}
// provide('updateResearch', updateResearch);

loadResearchParts();

async function loadResearchParts() {
  const data = {
    type: 'research',
    oper: 'get_prt_list',
    id: researchId,
    prop: { sort: 'src' },
  };

  const obj = await sendToServer(data);
  updateResearch({
    parts: obj.data,
  });
}
</script>

<style scoped>
.resprt-header {
  background-color: #ebebeb;
}

.resprt-header td {
  background-color: #ebebeb;
  padding: 2px 0 5px 0;
  /* border-bottom: 2px solid #e9e9e9; */
  font-size: 70%;
  position: sticky;
  top: 0;
  /* cursor: pointer; */
}

table {
  background-color: #e9e9e9;
  text-align: justify;
  /* max-width: 85%; */
}

div {
  border: 1px solid #9aaab9;
  /* max-width: fit-content; */
  /* max-height: inherit; */
  overflow-x: hidden;
  overflow-y: scroll;
  margin: 15px auto;
}
</style>

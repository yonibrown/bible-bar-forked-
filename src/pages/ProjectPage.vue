<template>
  <div>
    <section>
      <base-card>
        <h2>Project {{ project.id }}: {{ project.attr.name }}</h2>
      </base-card>
      <base-card v-for="elm in project.elements" :key="elm.id">
        <element-box :element="elm"></element-box>
      </base-card>
    </section>
  </div>
</template>

<script setup>
import ElementBox from '../components/layout/ElementBox.vue';
import { sendToServer } from '../server.js';

import { reactive, provide, computed } from 'vue';

const project = reactive({
  id: 1,
  attr: {
    name: '---',
    desc: '',
  },
  elements: [],
  links: []
});
provide('project', project);

const researches = reactive({
  list: []
});
provide('researches', researches);

const projectId = computed(function () {
  return { proj: project.id };
});
provide('projectId', projectId);

// link methods
function getLink(linkId) {
  const link = project.links.find((pLink) => {
    return pLink.id == linkId;
  });
  return link;
}
provide('getLink', getLink);

function getCategory(linkId, col) {
  const link = getLink(linkId);
  if (link == null) {
    return null;
  }
  const cat = link.categories.find((pCat) => {
    return pCat.col == col;
  });
  return cat;
}
provide('getCategory', getCategory);

// research methods
function getResearch(resId) {
  var res = researches.list.find((pRes) => {
    return pRes.id == resId;
  });
  if (res == null){
    res = {id:resId};
    researches.list.push(res);
  }
  return res;
}
provide('getResearch', getResearch);

loadProject();

async function loadProject() {
  const data = {
    type: 'project',
    oper: 'get',
    id: projectId.value,
    prop: { dummy: '' },
  };
  const obj = await sendToServer(data);

  project.attr = {
    name: obj.data.name,
    desc: obj.data.desc,
  };
  project.elements = obj.data.elements;
  project.links = obj.data.links;
  console.log(project);
}
</script>

<style scoped></style>
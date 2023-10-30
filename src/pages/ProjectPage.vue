<template>
  <div>
    <section>
      <base-card>
        <h2>Project {{ project.id }}: {{ project.attr.name }}</h2>
      </base-card>
      <base-card v-for="elm in elements" :key="elm.id">
        <element-box :element="elm"></element-box>
      </base-card>
    </section>
  </div>
</template>

<script setup>
import ElementBox from '../components/layout/ElementBox.vue';
import { sendToServer } from '../server.js';
import { reactive, provide, computed,ref } from 'vue';

const project = reactive({
  id: 1,
  attr: {
    name: '---',
    desc: '',
  },
  links: []
});

const projectId = computed(function () {
  return { proj: project.id };
});
provide('projectId', projectId);

const elements = ref([]);

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
  elements.value = obj.data.elements;
  project.links = obj.data.links;
  // console.log('project loaded');
  console.log(project);
}


// add a new element or reload an element
function openElement(attr){
  // if (typeof attr.opening_element != 'undefined'){
  //   var newElm = elements.value.find(function(dispElm){
  //     return dispElm.disp.opening_element == attr.opening_element;
  //   });
  // }

  createElement({
    proj: project.id,
    ...attr
  });
}
provide('openElement',openElement);

async function createElement(attr) {
  const data = {
    type: 'element',
    oper: 'new',
    id: { dummy: ''},
    prop: attr,
  };
  const obj = await sendToServer(data);
  console.log(obj.id)
}

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


function updateObject(obj,data){
  Object.assign(obj, data);
  // console.log('updateObject');
}

</script>

<style scoped></style>
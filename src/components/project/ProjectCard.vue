<template>
  <div class="card">
    <!-- <span class="title">
            Project {{ project.id }}: {{ project.attr.name }}
          </span> -->
    <base-editable
      :initialValue="projectName"
      @submitValue="submitName"
      name="projectName"
      :getDefault="defaultName"
    ></base-editable>
    <span class="menu-buttons">
      <!-- <menu-button type="reload" @click="reloadElement"></menu-button> -->
      <menu-button type="addtab" @click="addTab"></menu-button>
      <menu-button type="clipboard" @click="copyToClipboard"></menu-button>
      <menu-button type="add" @click="openNewElement"></menu-button>
      <menu-button type="close"></menu-button>
    </span>
  </div>
</template>

<script setup>
const props = defineProps(["openNewElement","copyToClipboard"]);
import { inject,ref } from "vue";

const project = inject("project");

const projectName = ref(project.value.name);

function submitName(newName) {
  projectName.value = newName;
  project.value.changeName(newName);
}

function defaultName() {
  return project.value.defaultName;
}

function addTab(){
  // console.log('project',project.value);
  project.value.addTab();
  // console.log('tabs',project.value._tabs);
}
</script>

<style scoped>
.menu-buttons {
  float: left;
}
.title {
  cursor: default;
  /* float: right; */
  font-weight: bold;
  font-size: 1.8em;
  margin: 0.83em 0;
}

.card{
    padding: 10px 40px;
    background-color: #c6d5f0;
}
</style>

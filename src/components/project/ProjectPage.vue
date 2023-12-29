<template>
  <div>
    <section>
      <base-card>
        <div>
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
            <menu-button type="add" @click="openNewElement"></menu-button>
            <menu-button type="close"></menu-button>
          </span>
        </div>
      </base-card>
      <element-list :elements="elements" ref="listRef"></element-list>
    </section>
  </div>
</template>

<script setup>
import MenuButton from "../ui/MenuButton.vue";
import ElementList from "./ElementList.vue";
import { ref,provide } from "vue";
import { useResearches } from "./researches.js";
import { useElements } from "./elements.js";
import { useLinks } from "./links.js";
import { biProject } from "./biProject.js";
import { biLink } from "./biLink.js";
import { biResearch } from "./biResearch";
import { biElement } from "./biElement";

const props = defineProps(["id"]);

const project = ref(new biProject(props.id));

biElement.setProjectId(props.id);

provide("elements", biElement.list);
provide("researches", biResearch.list);
provide("links", biLink.list);

const  elements = biElement.list;
useResearches();
  useElements();
  useLinks();


const listRef = ref();

// link methods
function openNewElement() {
  listRef.value.openNewElement();
}

// element name
function defaultName() {
  return project.value.defaultName();
}

const projectName = ref("");

function submitName(newName) {
  projectName.value = newName;
  project.value.changeName(newName);
}

project.value.loadProject().then(function () {
  projectName.value = project.value.getName();
});
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
</style>

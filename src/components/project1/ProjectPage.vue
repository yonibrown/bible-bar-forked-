<template>
  <div>
    <section v-if="projectLoaded" >
      <project-card
        :openNewElement="openNewElement"
        :copyToClipboard="copyToClipboard"
        @toggleEditMode="toggleEditMode"
        @toggleOptions="toggleOptions"
      >
      </project-card>
      <project-options v-show="showOptions">
      </project-options>
      <div class="tab-box">
        <div
          class="tab"
          v-for="tab in tabs"
          :style="{ width: tab.width_pct + '%' }"
        >
          <element-list
            :elements="elements"
            :tab="tab.id"
            ref="listRef"
          ></element-list>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import ProjectOptions from "./ProjectOptions.vue";
import ElementList from "./ElementList.vue";
import ProjectCard from "./ProjectCard.vue";
import { ref, provide, computed } from "vue";
import { biProject } from "../../store/biProject.js";

const props = defineProps(["id"]);

const projectLoaded = ref(false);
const project = ref(new biProject(props.id));
provide("project", project);

const editMode = ref(false);
function toggleEditMode() {
  editMode.value = !editMode.value;
}
provide("editMode", editMode);

const showOptions = ref(false);
function toggleOptions() {
  showOptions.value = !showOptions.value;
}
provide("showOptions", showOptions);

const tabs = computed(function () {
  return project.value.tabs;
});

const elements = computed(function () {
  return project.value.elements;
});
provide("elements", elements);

const links = computed(function () {
  return project.value.links;
});
provide("links", links);

const researches = computed(function () {
  return project.value.researches;
});
provide("researches", researches);

const listRef = ref([]);

function openNewElement() {
  listRef.value[0].openNewElement(0);
}

project.value.loadProject().then(function () {
  projectLoaded.value = true;
});

function copyToClipboard() {}
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

.tab {
  background-color: #ffffff;
  border: solid 1px #b4b4b4;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.26);
  overflow-y: scroll;
  overflow-x: hidden;
  flex-grow: 1;
}

.tab-box {
  display: flex;
  height: calc(100vh - 124px);
  flex-direction: row-reverse;
}
</style>

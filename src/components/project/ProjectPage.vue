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
import { ref } from "vue";
import { newProjectData } from "./project.js";

const props = defineProps(["id"]);

const { prjMethods, elements } = newProjectData(props.id);

const listRef = ref();

// link methods
function openNewElement() {
  listRef.value.openNewElement();
}

// element name
function defaultName() {
  return prjMethods.defaultName();
}

const projectName = ref("");

function submitName(newName) {
  projectName.value = newName;
  prjMethods.changeName(newName);
}

prjMethods.loadProject().then(function () {
  projectName.value = prjMethods.getName();
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

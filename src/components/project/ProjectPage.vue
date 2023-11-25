<template>
  <div>
    <section>
      <base-card>
        <div>
          <span class="title">
            Project {{ project.id }}: {{ project.attr.name }}
          </span>
          <span class="menu-buttons">
            <!-- <menu-button type="reload" @click="reloadElement"></menu-button> -->
            <menu-button type="add" @click="openNewElement"></menu-button>
            <menu-button type="close"></menu-button>
          </span>
        </div>
      </base-card>
      <element-list :elements="elements" ref="listRef"
      ></element-list>
    </section>
  </div>
</template>

<script setup>
import MenuButton from "../ui/MenuButton.vue";
import ElementList from "./ElementList.vue";
import { sendToServer } from "../../server.js";
import { reactive, provide, computed, ref } from "vue";
import { useElements } from "./elements.js";
import { useLinks } from "./links.js";
import { useResearches } from "./researches.js";

const props = defineProps(['id']);

const project = reactive({
  id: props.id,
  attr: {
    name: "---",
    desc: "",
  },
});

const projectId = computed(function () {
  return { proj: project.id };
});
provide("projectId", projectId);

const listRef = ref();

const [elements,elmMethods] = useElements();

const links = useLinks();
const [researches,resMethods] = useResearches();

loadProject();

async function loadProject() {
  const data = {
    type: "project",
    oper: "get",
    id: projectId.value,
    prop: { dummy: "" },
  };
  const obj = await sendToServer(data);
  project.attr = {
    name: obj.data.name,
    desc: obj.data.desc,
  };
  elements.value = obj.data.elements;
  links.value = obj.data.links;
  researches.value = obj.data.researches;
}

// add a new element or reload an element
async function createElement(attr, options) {
  const data = await elmMethods.elmCreate(project.id,attr);

  if (data.res){
    resMethods.addResearch(data.res);
  }
  if (options && options.openingElement) {
    const elm = options.openingElement;
    if (elm.type == "new") {
      elm.type = attr.type;
      elm.id = data.elm.id;
      elm.attr = data.elm.attr;
    } else {
      // elements = elements.concat([data]);
      elements.value.push(data.elm);
    }
  }
}
provide("createElement", createElement);

// link methods
function openNewElement(){
  listRef.value.openNewElement();
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
  font-size: 1.5em;
  margin: 0.83em 0;
}
</style>

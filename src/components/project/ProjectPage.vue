<template>
  <div>
    <section>
      <base-card>
        <div>
          <div class="title">
            Project {{ project.id }}: {{ project.attr.name }}
          </div>
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
import { reactive, provide, computed, ref ,watch} from "vue";
import { useLinks } from "./links.js";
import { useResearches } from "./researches.js";

const project = reactive({
  id: 1,
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

const elements = ref([]);

const links = useLinks();
const researches = useResearches();

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
  const data = {
    type: "element",
    oper: "new",
    id: { dummy: "" },
    prop: {
      proj: project.id,
      ...attr,
    },
  };
  const obj = await sendToServer(data);

  if (options && options.openingElement) {
    const elm = options.openingElement;
    if (elm.type == "new") {
      elm.type = attr.type;
      elm.id = obj.data.id;
      elm.attr = obj.data.attr;
    } else {
      // elements = elements.concat([data]);
      elements.value.push(data);
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
  float: right;
  font-weight: bold;
  font-size: 1.5em;
  margin: 0.83em 0;
}
</style>

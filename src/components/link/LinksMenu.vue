<template>
  <base-droppable
    :drop="addToLinks"
    :dragStruct="['linkId']"
    :dragEnter="enterLinksMenu"
    :dragLeave="leaveLinksMenu"
  >
    <base-menu :hilightMenu="hilightMenu">
      <span>{{title}}:</span>
      <links-menu-obj
        v-for="link in links"
        :key="link.id"
        :link="link"
        @removeLink="removeFromLinks(link)"
      ></links-menu-obj>
    </base-menu>
  </base-droppable>
</template>

<script setup>
import { inject,ref } from "vue";
import LinksMenuObj from "./LinksMenuObj.vue";
import { sendToServer } from "../../server.js";

const props = defineProps(['title']);

const getLink = inject("getLink");
const projectId = inject("projectId");
const elementId = inject("elementId");

const links = inject("links");
const hilightMenu = ref(false);

function enterLinksMenu() {
  hilightMenu.value = true;
}
function leaveLinksMenu() {
  hilightMenu.value = false;
}
function addToLinks(dragData) {
  const linkId = +dragData.linkId;
  if (linkId != 0) {
    const link = getLink(linkId);
    linkElement(link);
  }
}

function removeFromLinks(link){
  unlinkElement(link);
}

async function linkElement(link) {
  if (!link.elements.includes(elementId.value.elm)) {
    link.elements.push(elementId.value.elm);
  }

  const data = {
    type: "link",
    oper: "add_elm",
    id: {
      proj: projectId.value.proj,
      link: link.id,
    },
    prop: { elm: elementId.value.elm },
  };
  const obj = await sendToServer(data);
}

async function unlinkElement(link) {
  link.elements = link.elements.filter(function (arrElmId) {
    return arrElmId != elementId.value.elm;
  });

  const data = {
    type: "link",
    oper: "remove_elm",
    id: {
      proj: projectId.value.proj,
      link: link.id,
    },
    prop: { elm: elementId.value.elm },
  };
  const obj = await sendToServer(data);
}
</script>

<style scoped>
.menu * {
  margin-left: 3px;
}
</style>

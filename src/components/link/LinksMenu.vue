<template>
  <base-droppable
    :drop="addToLink"
    :dragStruct="['linkId']"
    :dragEnter="enterLinksMenu"
    :dragLeave="leaveLinksMenu"
  >
    <base-menu :hilightMenu="hilightMenu">
      <span>{{ title }}:</span>
      <links-menu-obj
        v-for="link in links"
        :key="link.id"
        :link="link"
        @removeLink="removeFromLink(link)"
      ></links-menu-obj>
    </base-menu>
  </base-droppable>
</template>

<script setup>
import { inject, ref } from "vue";
import LinksMenuObj from "./LinksMenuObj.vue";

const props = defineProps(["title"]);

const lnkMethods = inject("lnkMethods");
const elementObjId = inject("elementObjId");

const links = inject("links");
const hilightMenu = ref(false);

function enterLinksMenu() {
  hilightMenu.value = true;
}
function leaveLinksMenu() {
  hilightMenu.value = false;
}
function addToLink(dragData) {
  const linkId = +dragData.linkId;
  if (linkId != 0) {
    const link = lnkMethods.getLink(linkId);
    lnkMethods.addElementToLink(link, elementObjId);
  }
}

function removeFromLink(link) {
  lnkMethods.removeElementFromLink(link, elementObjId);
}
</script>

<style scoped>
.menu * {
  margin-left: 3px;
}
</style>

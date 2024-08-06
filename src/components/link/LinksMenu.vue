<template>
  <base-droppable
    :drop="addToLink"
    :dragStruct="['linkId', 'resId']"
    :dragEnter="enterLinksMenu"
    :dragLeave="leaveLinksMenu"
  >
    <base-menu :hilightMenu="hilightMenu">
      <span>{{ title }}:</span>
      <links-menu-obj
        v-for="link in links"
        :key="link.id"
        :link="link"
      ></links-menu-obj>
    </base-menu>
  </base-droppable>
</template>

<script setup>
import { inject, ref } from "vue";
import LinksMenuObj from "./LinksMenuObj.vue";
import { biLink } from "../../store/biLink.js";

const props = defineProps(["title"]);

const project = inject("project");
const element = inject("element");

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
    const link = project.value.getLink({ id: linkId });
    link.addElementToLink( element.value.id);
    return;
  }

  const resId = +dragData.resId;
  if (resId != 0) {
    const link = project.value.getLink({ res: resId });
    if (link) {
      link.addElementToLink( element.value.id);
    } else {
      biLink.createLink({
        researchId: resId,
        element: element.value,
      });
    }
    return;
  }
}
</script>

<style scoped>
.menu * {
  margin-left: 3px;
}
</style>

<template>
  <div v-show="editMode">
    <sequence-menu
      v-show="editMode"
      :displayScale="false"
      :enableWholeText="false"
    ></sequence-menu>
    <links-menu title="הדגשות"></links-menu>
    <text-menu @updateData="updateData"></text-menu>
  </div>
  <ContextMenu ref="menu" :model="items" />
  <div>
    <base-scrollable class="bible-text">
      <div
        class="text-box"
        ref="textRef"
        @contextmenu="onImageRightClick"
        style="
          font-size: 155%;
          font-family: David, sans-serif;
          text-align: justify;
          direction: rtl;
        "
      >
        <text-verse
          v-for="vrs in verses"
          :key="vrs.part_id"
          :verse="vrs"
        ></text-verse>
      </div>
    </base-scrollable>
  </div>
</template>

<script setup>
import TextMenu from "./TextMenu.vue";
import LinksMenu from "../link/LinksMenu.vue";
import SequenceMenu from "../sequence/SequenceMenu.vue";
import TextVerse from "./TextVerse.vue";
import { inject, ref, computed, provide } from "vue";
import { writeToClipboard } from "../../general.js";
import ContextMenu from 'primevue/contextmenu';

const editMode = inject("editMode");
const element = inject("element");
const elementAttr = inject("elementAttr");
const project = inject("project");
const links = inject("links");

const textRef = ref();

const menu = ref();
const items = ref([
    { label: 'Copy', icon: 'pi pi-copy' },
    { label: 'Rename', icon: 'pi pi-file-edit' }
]);

const onImageRightClick = (event) => {
    menu.value.show(event);
};

const verses = computed(function () {
  if (!element.value || !element.value.verses) {
    return [];
  }
  return element.value.verses;
});

element.value.loadText();

function updateData(data) {
  switch (data.action) {
    case "addToCat":
      const range = getSelectionInElement(textRef.value);
      if (range) {
        const res = project.value.getResearch(data.prop.research_id);
        res.newPart({
          collection_id: data.prop.collection_id,
          src_research: elementAttr.value.research_id,
          src_collection: elementAttr.value.collection_id,
          src_from_position: closestAttr(range.start, "res-position"),
          src_from_word: Math.ceil(closestAttr(range.start, "res-word")),
          src_to_position: closestAttr(range.end, "res-position"),
          src_to_word: Math.floor(closestAttr(range.end, "res-word")),
        });
        range.collapse();
      }
      break;
  }
}

function getSelectionInElement(elm) {
  var selection = window.getSelection();
  if (selection.baseNode) {
    var range = selection.getRangeAt(0);
    if (elm.contains(range.commonAncestorContainer)) {
      // let content = range.extractContents();
      return {
        start: range.startContainer.parentElement,
        end: range.endContainer.parentElement,
        collapse: function () {
          range.collapse();
        },
      };
    }
  }
  return null;
}
function closestAttr(elm, attr) {
  return elm.closest("[" + attr + "]").getAttribute(attr);
}

function copyToClipboard() {
  writeToClipboard(textRef.value.outerHTML,'html');
}

const linkedParts = computed(function () {
  const parts = [];
  for (let link of links.value) {
    for (let cat of link.categories) {
      let res = project.value.getResearch(cat.res);
      let col = res.getCollection(cat.col);
      for (let prt of col.parts) {
        if (
          prt.src_from_position >= elementAttr.value.from_position &&
           prt.src_to_position <= elementAttr.value.to_position
        ) {
          parts.push({prt,cat});
        }
      }
    }
  }
  return parts;
});
provide('linkedParts',linkedParts);

defineExpose({ copyToClipboard });
</script>

<style scoped>
.text-box {
  padding: 15px;
}
</style>

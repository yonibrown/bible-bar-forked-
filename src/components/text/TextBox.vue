<template>
  <div v-show="displayOptions">
    <sequence-menu
      v-show="displayOptions"
      :displayScale="false"
      :enableWholeText="false"
    ></sequence-menu>
    <links-menu title="הדגשות"></links-menu>
    <text-menu @updateData="updateData"></text-menu>
  </div>
  <div>
    <base-scrollable class="bible-text">
      <div class="text-box" ref="textRef">
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
import { inject, ref } from "vue";

const displayOptions = inject("displayOptions");
const element = inject("element");
const elementAttr = inject("elementAttr");
const elmMethods = inject("elmMethods");
const resMethods = inject("resMethods");

const verses = ref([]);
const textRef = ref();

loadElmText();

async function loadElmText() {
  verses.value = await elmMethods.loadText(element.value);
  // console.log(verses.value);
}

defineExpose({ reload: loadElmText });

function updateData(data) {
  switch (data.action) {
    case "addToCat":
      var range = getSelectionInElement(textRef.value);
      if (range) {
        console.log("prop", data.prop);
        console.log("src_research", elementAttr.value.research_id);
        console.log("src_collection", elementAttr.value.collection_id);
        console.log(
          "src_from_position",
          closestAttr(range.start, "res-position")
        );
        console.log(
          "src_from_word",
          Math.ceil(closestAttr(range.start, "res-word"))
        );
        console.log("src_to_position", closestAttr(range.end, "res-position"));
        console.log(
          "src_to_word",
          Math.floor(closestAttr(range.end, "res-word"))
        );
        resMethods.newPart({
          res: data.prop.research_id,
        },{
          collection_id: data.prop.collection_id,
          src_research: elementAttr.value.research_id,
          src_collection: elementAttr.value.collection_id,
          src_from_position: closestAttr(range.start, "res-position"),
          src_from_word: Math.ceil(closestAttr(range.start, "res-word")),
          src_to_position: closestAttr(range.end, "res-position"),
          src_to_word: Math.floor(closestAttr(range.end, "res-word")),
        });
      }
      break;
  }
}

function getSelectionInElement(elm) {
  var selection = window.getSelection();
  console.log(selection);
  if (selection.baseNode) {
    var range = selection.getRangeAt(0);
    console.log(range);
    if (elm.contains(range.commonAncestorContainer)) {
      console.log("contains");
      // let content = range.extractContents();
      // console.log(content);
      return {
        start: range.startContainer.parentElement,
        end: range.endContainer.parentElement,
      };
    }
  }
  return null;
}
function closestAttr(elm, attr) {
  return elm.closest("[" + attr + "]").getAttribute(attr);
}
</script>

<style scoped>
.text-box {
  padding: 15px;
}
</style>

<template>
  <ContextMenu ref="fieldMenuRef" :model="fieldMenuData">
    <template #item="{ item }">
      <div class="context" :class="{ checked: item.checked }">
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </div>
    </template>
  </ContextMenu>
</template>

<script setup>
import ContextMenu from "primevue/contextmenu";
import { inject, computed, ref } from "vue";
import { biResearch } from "../../store/biResearch.js";

const props = defineProps(["field"]);
const emit = defineEmits([
  "addField",
  "deleteField",
  "toggleDisplayWholeVerse",
  "changeReferenceStyle",
]);

const fieldMenuRef = ref();

function show() {
  fieldMenuRef.value.show(event);
}

const fieldMenuData = computed(function () {
  // 'add field' options
  const addArr = [
    {
      label: "טקסט חופשי",
      icon: "fa fa-align-right",
      command: () => {
        emit("addField", "FreeText");
      },
    },
    {
      label: "טווח פסוקים",
      icon: "fa fa-book",
      command: () => {
        emit("addField", "SourceVerse");
      },
    },
  ];

  if (props.field && props.field.type == "SourceVerse") {
    addArr.push({ separator: true });
    addArr.push({
      label: "מילים מתוך פסוק",
      icon: "fa fa-file-text-o",
      command: () => {
        emit("addField", "SourceWord");
      },
    });
  }

  // 'verse reference style' options
  const verseRefArr = biResearch.getReferenceStyles().map(function (st) {
    return {
      label: st.label,
      icon:
        props.field && props.field.referenceStyle == st.value
          ? "fa fa-check"
          : "",
      checked: props.field && props.field.referenceStyle == st.value,
      command: () => {
        emit("changeReferenceStyle", st.value);
      },
    };
  });

  // main options
  const arr = [
    {
      label: "מחק עמודה",
      icon: "fa fa-close",
      command: () => {
        emit("deleteField");
      },
    },
    { label: "הוסף", icon: "fa fa-plus", items: addArr },
  ];

  if (props.field && props.field.type == "SourceWord") {
    arr.push({ separator: true });
    arr.push({
      label: "הצג פסוק שלם",
      icon: props.field.displayWholeVerse ? "fa fa-check":"",
      checked: props.field.displayWholeVerse,
      command: () => {
        emit("toggleDisplayWholeVerse");
      },
    });
  }

  if (props.field && props.field.type == "SourceVerse") {
    arr.push({ separator: true });
    arr.push({
      label: "סגנון הפניה",
      items: verseRefArr,
    });
  }

  return arr;
});

defineExpose({ show });
</script>

<style scoped>
.context {
  padding: 8px;
  cursor: default;
}
.context > span {
  margin: 10px;
}
.checked {
  background-color: #d7e3f1;
}
</style>

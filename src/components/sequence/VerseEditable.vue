<template>
  <form @submit.prevent="submitValue" class="menu" v-if="editing">
    <sequence-key
      :initialValue="initialKey"
      @changeValue="(newVal) => updateAttr('from_div', newVal)"
      defaultValue="min"
      ref="fromRef"
    ></sequence-key>
    <button>שמור</button>
  </form>
  <span
    v-else
    @dblclick="startEdit"
    :class="{ placeholder: noTitle }"
    class="title"
  >
    {{ title }}
  </span>
</template>

<script setup>
import { ref, watch, computed, inject } from "vue";
import SequenceKey from "../sequence/SequenceKey.vue";
import { biResearch } from "../../store/biResearch.js";

const props = defineProps([
  "initialValue",
  "name",
  "getDefault",
  "disabled",
  "placeholder",
  "blankable",
  "initPosition",
]);
const emit = defineEmits(["submitValue"]);

const seqIndex = inject("seqIndex");

var changedAttr = {};
const hasChanges = ref(false);

const editing = ref(false);
const currentValue = ref(props.initialValue);
const initialKey = ref(null);

const title = computed(function () {
  if (props.initialValue == "" && !props.disabled) {
    return props.placeholder;
  }
  return props.initialValue;
});
const noTitle = computed(function () {
  return props.initialValue == "";
});

const input = ref(null);
watch(input, function (newVal) {
  if (newVal) {
    // newVal.focus();
    newVal.select();
  }
});

function submitValue() {
  if (currentValue.value == "" && !props.blankable) {
    currentValue.value = props.getDefault();
  }

  leaveEdit();
  emit("submitValue", currentValue.value);
}

async function startEdit() {
  if (!props.disabled) {
    initialKey.value = await biResearch.loadKey(seqIndex.value, {
      position: props.initPosition,
    });
    console.log("initialKey", initialKey.value);
    editing.value = true;
  }
}

function leaveEdit() {
  editing.value = false;
}

function inputFocusout(evt) {
  if (!evt.relatedTarget) {
    leaveEdit();
  }
}

function inputKeydown(evt) {
  if (evt.keyCode == 27) {
    leaveEdit();
  }
}

function updateAttr(attr, newVal) {
  console.log("updateAttr", attr, newVal);
  hasChanges.value = true;
  changedAttr[attr] = newVal;

  // if ((attr = "from_div")) {
  //   if (getSeqDiv("to") < newVal) {
  //     toRef.value.updateKey(fromRef.value.getKey());
  //     changedAttr["to_div"] = newVal;
  //   }
  // }
}
</script>

<style scoped>
.placeholder {
  color: rgb(196, 196, 196);
}
</style>

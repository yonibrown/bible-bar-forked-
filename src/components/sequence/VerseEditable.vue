<template>
  <form @submit.prevent="submitValue" class="menu" v-if="editing">
    <sequence-key
      :initialValue="initialKey"
      @changeValue="updateDiv"
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
  "initDivision",
]);
const emit = defineEmits(["submitValue"]);

const seqIndex = inject("seqIndex");

var changedAttr = {};
const hasChanges = ref(false);

const editing = ref(false);
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
  leaveEdit();
  emit("submitValue", changedAttr);
}

async function startEdit() {
  if (!props.disabled) {
    let indexParm = null;
    if (props.initDivision) {
      indexParm = { division_id: props.initDivision };
    } else {
      indexParm = { position: props.initPosition };
    }
    initialKey.value = await biResearch.loadKey(seqIndex.value, indexParm);
    editing.value = true;
  }
}

function leaveEdit() {
  editing.value = false;
}

// function inputFocusout(evt) {
//   if (!evt.relatedTarget) {
//     leaveEdit();
//   }
// }

// function inputKeydown(evt) {
//   if (evt.keyCode == 27) {
//     leaveEdit();
//   }
// }

function updateDiv(newVal) {
  hasChanges.value = true;
  changedAttr["div"] = newVal.id;
  changedAttr["name"] = newVal.name;

  // if ((attr = "from_div")) {
  //   if (getSeqDiv("to") < newVal) {
  //     toRef.value.updateKey(fromRef.value.getKey());
  //     changedAttr["to_div"] = newVal;
  //   }
  // }
}

watch(
  computed(function () {
    return props.disabled;
  }),
  function (newVal) {
    if (newVal) {
      editing.value = false;
    }
  }
);
</script>

<style scoped>
.placeholder {
  color: rgb(196, 196, 196);
}
</style>

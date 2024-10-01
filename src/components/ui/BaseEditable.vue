<template>
  <form @submit.prevent="submitValue" class="menu" v-if="editing">
    <input
      type="text"
      id="editable"
      :name="name"
      ref="input"
      v-model.trim="currentValue"
      @focusout="inputFocusout"
      @keydown="inputKeydown"
    />
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
import { ref, watch, computed } from "vue";

const props = defineProps([
  "initialValue",
  "name",
  "getDefault",
  "disabled",
  "placeholder",
  "blankable",
]);
const emit = defineEmits(["submitValue"]);

const editing = ref(false);
const currentValue = ref(props.initialValue);

const title = computed(function () {
  if (noTitle.value) {
    return props.placeholder;
  }
  return props.initialValue;
});
const noTitle = computed(function () {
  return (!props.initialValue || props.initialValue == "") && !props.disabled;
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

function startEdit() {
  if (!props.disabled) {
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
</script>

<style scoped>
.placeholder {
  color: rgb(196, 196, 196);
}
</style>

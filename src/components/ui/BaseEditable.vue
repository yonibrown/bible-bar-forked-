<template>
  <form @submit.prevent="submitValue" class="menu" v-if="editingValue">
    <input
      type="text"
      id="editable"
      :name="name"
      ref="input"
      v-model.trim="editableValue"
    />
    <button>שמור</button>
  </form>
  <span
    v-else
    @dblclick="starteditValue"
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
  "defaultValue",
  "disabled",
  "placeholder",
  "blankable",
]);
const emit = defineEmits(["submitValue"]);

const editingValue = ref(false);
const editableValue = ref(props.initialValue);

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
  console.log(props);
  if (editableValue.value == "" && !props.blankable) {
    editableValue.value = props.defaultValue;
  }

  editingValue.value = false;
  emit("submitValue", editableValue.value);
}

function starteditValue() {
  if (!props.disabled) {
    editingValue.value = true;
  }
}
</script>

<style scoped>
.placeholder {
  color: rgb(196, 196, 196);
}
</style>

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
  <div v-else @dblclick="starteditValue" class="title">
    {{ initialValue }}
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps(["initialValue", "name","defaultValue"]);
const emit = defineEmits(["submitValue"]);

const editingValue = ref(false);
const editableValue = ref(props.initialValue);

const input = ref(null);
watch(input, function (newVal) {
  if (newVal) {
    // newVal.focus();
    newVal.select();
  }
});

function submitValue() {
  if (editableValue.value == "") {
    editableValue.value = props.defaultValue;
  } 

  editingValue.value = false;
  emit("submitValue", editableValue.value);
}

function starteditValue() {
  editingValue.value = true;
}
</script>
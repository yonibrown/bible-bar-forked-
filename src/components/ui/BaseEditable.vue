<template>
  <form @submit.prevent="submitValue" class="menu">
    <input
      type="text"
      id="editable"
      :name="props.name"
      ref="input"
      v-model.trim="editableValue"
    />
    <button>שמור</button>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps(["initialValue","name"]);
const emit = defineEmits(["submitValue"]);

const editableValue = ref(props.initialValue);

const input = ref(null);
watch(input, function (newVal) {
  if (newVal) {
    newVal.focus();
  }
});

function submitValue(){
    emit('submitValue',editableValue.value);
}
</script>

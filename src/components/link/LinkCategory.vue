<template>
  <div class="link-category">
    <input type="checkbox" v-model="checked" />
    <input type="color" name="color" v-model="color" />
    <span class="category">{{ category.name }}</span>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps(["category"]);
const emit = defineEmits(["updateCategory"]);
const checked = ref(props.category.display);
const color = ref(props.category.color);

watch(checked, (newVal) => {
  emit("updateCategory", { display: newVal });
});
watch(color, (newVal) => {
  emit("updateCategory", { color: newVal });
});
</script>

<style scoped>
.category {
  margin-right: 4px;
}

.link-category {
  margin: 3px;
  width: 100%;
}

input[type="color"] {
  height: 12px;
  width: 12px;
  border: none;
  padding: 0;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
  background-color: #e4e9f1;
}
input[type="color"]::-webkit-color-swatch {
  border-radius: 50%;
  border: 1px solid;
}
</style>

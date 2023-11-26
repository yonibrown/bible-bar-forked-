<template>
  <div class="tabs">
    <button
      v-for="tab in tabList"
      :class="{ active: tab.name == currentTab }"
      @click="$emit('changeTab', tab.name)"
    >
      {{ tab.title }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps(["tabList", "currentTab"]);
const emit = defineEmits(["changeTab"]);
</script>

<style scoped>
.tabs {
  /* overflow: hidden; */
  border: 1px solid #ccc;
  background-color: #f1f1f1;
  width: fit-content;
}

/* Style the buttons that are used to open the tab content */
.tabs button {
  background-color: inherit;
  float: right;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 2px 16px;
  transition: 0.3s;
}

/* Change background color of buttons on hover */
.tabs button:hover {
  background-color: #ddd;
}

/* Create an active/current tablink class */
.tabs button.active {
  background-color: #ccc;
}
</style>

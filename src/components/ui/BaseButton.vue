<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<script setup>
const props = defineProps(['mode','link','to']);
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 0.5rem 1.2rem;
  font: inherit;
  background-color: #6079a7;
  border: 1px solid #476090;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 1.5rem;
  display: inline-block;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: #3a5586;
  border-color: #34476b;
}

.flat {
  background-color: transparent;
  color: #476090;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #476090;
  color: #476090;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #edd2ff;
}
</style>
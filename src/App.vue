<template>
  <the-header></the-header>
  <router-view v-slot="slotProps" class="page-body">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </transition>
  </router-view>
</template>

<script setup>
import TheHeader from "./components/layout/TheHeader.vue";
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

/* * {
  box-sizing: border-box;
} */

.bible-text {
  font-family: David, sans-serif;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
  background-color: #eef0f2;
}

.page-body {
  margin-top: 70px;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 2rem auto;
  max-width: 85%;
  max-height: 20rem;
  /* max-width: 40rem; */

  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}
</style>
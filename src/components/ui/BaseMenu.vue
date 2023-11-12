<template>
    <div class="menu" :class="{ 'hilight-menu': hilightMenu }">
        <slot></slot>
    </div>
</template>

<script setup>
const props = defineProps(['hilightMenu']);
</script>

|<style scoped>
.menu {
  background-color: rgb(230, 230, 230);
  border-style: solid;
  border-width: 0.1px;
  border-color: rgb(206, 206, 206);
  margin: 5px 0px 5px 0px;
  padding: 5px 15px 5px 15px;
}

.menu * {
  margin-left: 6px;
}
.hilight-menu {
  background-color: rgb(255, 253, 238);
}

</style>
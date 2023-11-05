<template>
    <div class="menu">
        <slot></slot>
    </div>
</template>

|<style scoped>
.menu {
  background-color: rgb(230, 230, 230);
  border-style: solid;
  border-width: 0.1px;
  border-color: rgb(206, 206, 206);
  margin: 5px 0px 5px 0px;
  padding: 5px 15px 5px 15px;
}

div * {
  margin-left: 6px;
}
</style>
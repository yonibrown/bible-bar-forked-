<template>
  <tr class="link-category">
    <td>
      <input type="checkbox" v-model="checked"/>
      <svg height="12" width="12">
        <circle
          cx="6"
          cy="6"
          r="5"
          stroke="black"
          stroke-width="1"
          :fill="category.color"
        ></circle>
      </svg>
      <span>{{category.name}}</span>
    </td>
  </tr>
</template>

<script setup>
import { ref,watch } from 'vue';

const props = defineProps(['category']);
const emit = defineEmits(['updateCategory']);
const checked = ref(props.category.display);

watch(checked, (newDisplay) => {
  emit('updateCategory', {display:newDisplay});
});

</script>

<style scoped></style>

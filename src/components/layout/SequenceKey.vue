<template>
  <span>
    <select v-for="level in keyLevels" :key="level.level">
      <option v-for="div in level.divisions" :selected="div.selected">
        {{ div.name }}
      </option>
    </select>
  </span>
</template>

<script setup>
import { sendToServer } from '../../server.js';
import { ref } from 'vue';
const props = defineProps(['ikey']);

const keyLevels = ref([]);

loadIndex();

async function loadIndex() {
  const data = {
    type: 'res_index',
    oper: 'get_divisions',
    id: { res: 1, col: 1, idx: 1 },
    prop: {
      key: props.ikey,
    },
  };
  //   console.log(props);
  const obj = await sendToServer(data);

  console.log(obj.data);
  keyLevels.value = obj.data;
}
</script>

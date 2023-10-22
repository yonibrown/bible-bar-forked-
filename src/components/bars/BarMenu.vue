<template>
  <div>
    <span>טקסט:</span>
    <select>
      <option value="1_1" selected="selected">נוסח המסורה</option>
    </select>
    <span>חלוקה:</span>
    <select>
      <option value="1" selected="selected">חלוקה לפרקים</option>
    </select>
    <span>סקאלה:</span>
    <select>
      <option value="3" selected="selected">חטיבות</option>
      <option value="2">ספרים</option>
      <option value="1">פרקים</option>
      <option value="0">פסוקים</option>
    </select>
    <input type="submit" class="bar_filter_toggle" value="מיקוד <<" />
    <span class="bar_filter_group" style="display: inline">
      <span>מ-</span>
      <sequence-key :ikey="attr.from_key"></sequence-key>
      <span>עד</span>
      <sequence-key :ikey="attr.to_key"></sequence-key>
      <input type="submit" value="הסר מיקוד" />
    </span>
    <input type="submit" value="החל" />
  </div>
</template>

<script setup>
import SequenceKey from '../layout/SequenceKey.vue';
import BarSegment from './BarSegment.vue';
import BarPoint from './BarPoint.vue';
import { sendToServer } from '../../server.js';

import { computed, inject } from 'vue';

const props = defineProps(['element']);
const elementId = inject('elementId');
const updateElement = inject('updateElement');

const attr = computed(function () {
  return props.element.attr;
});

</script>

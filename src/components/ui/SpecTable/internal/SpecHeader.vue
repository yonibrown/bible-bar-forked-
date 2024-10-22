<template>
  <tr ref="row">
    <td v-show="enableSelection"></td>
    <td v-show="fld.display" v-for="(fld, fldidx) in tableFields">
      <column-sortable :fldidx="fldidx">
        <column-resizer
          ref="headCell"
          :key="fld.id"
          :fld="fld"
          :lastField="fldidx + 1 == tableFields.length"
          @resize="(style) => resizeCell(fldidx, style)"
        >
          <column-sortable-head>
            <column-title
              v-if="tableProps.randomSortAvailable"
              :fld="fld"
            ></column-title>
            <column-title-sort :fld="fld" v-else></column-title-sort>
          </column-sortable-head>
          <span class="menu-buttons" v-show="enableSelection">
            <menu-button
              type="options"
              @click="tableEmit('openFieldMenu', { idx: fldidx })"
            ></menu-button>
            <menu-button
              type="sort-asc"
              @click="
                tableEmit('sortLines', { fldId: fld.id, ascending: true })
              "
            ></menu-button>
            <menu-button
              type="sort-desc"
              @click="
                tableEmit('sortLines', { fldId: fld.id, ascending: false })
              "
            ></menu-button>
          </span>
        </column-resizer>
      </column-sortable>
    </td>
  </tr>
</template>

<script setup>
import ColumnSortable from "./ColumnSortable.vue";
import ColumnSortableHead from "./ColumnSortableHead.vue";
import ColumnResizer from "./ColumnResizer.vue";
import ColumnTitleSort from "./ColumnTitleSort.vue";
import ColumnTitle from "./ColumnTitle.vue";
import { ref, provide, inject, onMounted } from "vue";

const enableSelection = inject("enableSelection");
const tableFields = inject("tableFields");
const tableEmit = inject("tableEmit");
const tableProps = inject("tableProps");

// store row width
const row = ref();
const rowWidth = ref(0);
onMounted(function () {
  rowWidth.value = parseInt(
    document.defaultView.getComputedStyle(row.value).width,
    10
  );
});
provide("rowWidth", rowWidth);
defineExpose({
  tr: row,
});
</script>

<style scoped>
tr {
  background-color: #e4e4e4;
  user-select: none;
}

td {
  background-color: #e4e4e4;
  /* border-bottom: 2px solid #e9e9e9; */
  position: sticky;
  top: 0;
  padding: 2px 5px 5px 2px;
  /* border-bottom: 2px solid #e9e9e9; */
  font-size: 71%;
  /* cursor: pointer; */
}

.menu-buttons {
  padding-right: 2px;
}
</style>

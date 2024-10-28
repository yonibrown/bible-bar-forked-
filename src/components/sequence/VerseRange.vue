<template>
  <form @submit.prevent="submitValue" class="menu" v-if="editing">
    <verse-editable
      :initialKey="fromKey"
      :initPosition="fromPosition"
      :initDivision="fromDivision"
      ref="fromRef"
    ></verse-editable>
    <span v-if="displayOneVerse">
      <button class="disp-range" v-show="showRangeButton" @click="displayRange">
        טווח
      </button>
    </span>
    <span v-else>
      -
      <verse-editable
        :initialKey="toKey"
        :initPosition="toPosition"
        :initDivision="toDivision"
        ref="toRef"
      ></verse-editable>
    </span>
    <button>שמור</button>
  </form>
  <span
    v-else
    @dblclick="startEdit"
    :class="{ placeholder: fromName == '' }"
    class="title"
  >
    {{ title }}
  </span>
</template>

<script setup>
import VerseEditable from "./VerseEditable.vue";
import { computed, provide, ref, watch } from "vue";
import { biResearch } from "../../store/biResearch.js";

const props = defineProps(["part", "editable", "referenceStyle"]);
const emit = defineEmits(["changeValue"]);

const defaultIndex = { res: 1, col: 1, idx: 1 };
const defaultDivision = 972; /* Genesis,1,1 */

provide(
  "referenceStyle",
  computed(function () {
    return props.referenceStyle;
  })
);

const showRangeButton = computed(function () {
  // return props.editable ;
  return props.editable && fromName.value != "";
});

const fromPosition = computed(function () {
  if (props.part) {
    return props.part.src_from_position;
  }
});

const fromDivision = computed(function () {
  if (props.part) {
    return props.part.src_from_division;
  }
});

const toPosition = computed(function () {
  if (props.part) {
    return props.part.src_to_position;
  }
});

const toDivision = computed(function () {
  if (props.part) {
    return props.part.src_to_division;
  }
});

const seqIndex = computed(function () {
  if (props.part) {
    return {
      res: props.part.src_research,
      col: props.part.src_collection,
      idx: 1,
    };
  }
  return defaultIndex;
});
provide("seqIndex", seqIndex);

const displayOneVerse = ref(
  !props.part
    ? true
    : props.part.src_from_division
    ? props.part.src_from_division == props.part.src_to_division
    : props.part.src_from_position == props.part.src_to_position
);
function displayRange() {
  displayOneVerse.value = false;
}

const fromName = computed(function () {
  if (props.part) {
    return props.part.src_from_name.replaceAll(",", " ");
  }
  return "";
});

const toName = computed(function () {
  if (props.part) {
    return props.part.src_to_name.replaceAll(",", " ");
  }
  return "";
});

function submitValue() {
  var fromDiv = props.part.src_from_division;
  var toDiv = props.part.src_to_division;
  var updAttr = {};

  if (!props.part) {
    updAttr.src_index = defaultIndex;
  }

  if (fromRef.value.changedAttr.div) {
    updAttr.src_from_division = fromRef.value.changedAttr.div;
    updAttr.src_from_name = fromRef.value.changedAttr.name;
    updAttr.src_from_word = 0;
    if (displayOneVerse.value) {
      updAttr.src_to_division = fromRef.value.changedAttr.div;
      updAttr.src_to_name = fromRef.value.changedAttr.name;
      updAttr.src_to_word = 0;
    }
    fromDiv = fromRef.value.changedAttr.div;
  }

  if (toRef.value && toRef.value.changedAttr.div) {
    updAttr.src_to_division = toRef.value.changedAttr.div;
    updAttr.src_to_name = toRef.value.changedAttr.name;
    updAttr.src_to_word = 999;
    toDiv = toRef.value.changedAttr.div;
  }

  if (fromDiv == toDiv) {
    displayOneVerse.value = true;
  }

  editing.value = false;
  emit("changeValue", updAttr);
}

const title = computed(function () {
  if (fromName.value != "") {
    if (toName.value != "") {
      return fromName.value + " - " + toName.value;
    }
    return fromName.value;
  }
  return "בחר פסוק...";
});

const fromRef = ref();
const toRef = ref();
const editing = ref(false);
const fromKey = ref(null);
const toKey = ref(null);
async function startEdit() {
  if (props.editable) {
    // from
    if (fromDivision.value) {
      fromKey.value = await biResearch.getKey(seqIndex.value, {
        division_id: fromDivision.value,
      });
    } else if (fromPosition.value) {
      fromKey.value = await biResearch.getKey(seqIndex.value, {
        position: fromPosition.value,
      });
    } else {
      fromKey.value = null;
    }

    // to
    if (toDivision.value) {
      toKey.value = await biResearch.getKey(seqIndex.value, {
        division_id: toDivision.value,
      });
    } else if (toPosition.value) {
      toKey.value = await biResearch.getKey(seqIndex.value, {
        position: toPosition.value,
      });
    } else {
      toKey.value = null;
    }

    editing.value = true;
  }
}

watch(
  computed(function () {
    return props.editable;
  }),
  function (newVal) {
    if (!newVal) {
      editing.value = false;
    }
  }
);
</script>

<style scoped>
.disp-range {
  margin-right: 5px;
}

.placeholder {
  color: rgb(196, 196, 196);
}
</style>

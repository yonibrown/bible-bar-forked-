import { provide, ref, computed } from "vue";

export function useResearches() {
  const researches = ref([]);
  provide("researches", researches);

  function getResearch(researchId) {
    const research = researches.value.find((pResearch) => {
      return pResearch.id == researchId;
    });
    return research;
  }
  provide("getResearch", getResearch);

  function getCollection(researchId, colId) {
    const research = getResearch(researchId);
    if (research == null) {
      return null;
    }
    const col = research.collections.find((pCol) => {
      return pCol.col == colId;
    });
    return col;
  }
  provide("getCollection", getCollection);

  const collections = computed(function () {
    const arr = [];
    researches.value.forEach(function (res) {
      arr.push({
        resId: res.id,
        id: 0,
        name: res.name,
      });
      res.collections.forEach(function (col) {
        arr.push({
          resId: res.id,
          id: col.id,
          name: col.name,
        });
      });
    });
    return arr;
  });
  provide("collections", collections);

  return researches;
}

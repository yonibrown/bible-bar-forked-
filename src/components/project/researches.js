import { provide, ref } from "vue";

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

  return researches;
}

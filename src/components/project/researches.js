import { provide, ref, computed } from "vue";
import { sendToServer } from "../../server.js";

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
      return pCol.id == colId;
    });
    return col;
  }
  provide("getCollection", getCollection);

  async function updateCollection(col,newAttr){
    // console.log(col);
    // col.name = newAttr.name;
    Object.assign(col, newAttr);
    const data = {
      type: "research",
      oper: "update_collection",
      id: {res: col.res},
      prop: {
        col: col.id,
        ...newAttr
      },
    };
    console.log(data);
    const obj = await sendToServer(data);
  }
  provide("updateCollection", updateCollection);

  return researches;
}

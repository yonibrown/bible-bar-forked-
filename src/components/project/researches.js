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

    const obj = await sendToServer(data);
  }
  provide("updateCollection", updateCollection);

  async function newCollection(col,newAttr){
    console.log('not yet implemented');
    // Object.assign(col, newAttr);
    // const data = {
    //   type: "research",
    //   oper: "update_collection",
    //   id: {res: col.res},
    //   prop: {
    //     col: col.id,
    //     ...newAttr
    //   },
    // };

    // const obj = await sendToServer(data);
  }
  provide("newCollection", newCollection);

  function addResearch(res){
    researches.value.push(res);
    console.log('after addResearch',researches);
  }
  provide("addResearch", addResearch);

  const resMethods = {
    getResearch,getCollection,updateCollection,newCollection,addResearch
  }

  return [researches,resMethods];
}

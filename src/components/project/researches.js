import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useResearches() {
  const researches = ref([]);
  provide("researches", researches);

  // local objects
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

  function addResearch(res){
    researches.value.push(res);
  }
  provide("addResearch", addResearch);

  // server
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

  async function newCollection(res,newAttr){
    const data = {
      type: "research",
      oper: "new_collection",
      id: {res: res.id},
      prop: newAttr,
    };

    const obj = await sendToServer(data);
    res.collections.push(obj.data);
  }
  provide("newCollection", newCollection);

  // return
  const resMethods = {
    getResearch,getCollection,updateCollection,newCollection,addResearch
  }

  return [researches,resMethods];
}

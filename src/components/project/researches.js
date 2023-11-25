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

  function addResearch(res) {
    researches.value.push(res);
  }
  provide("addResearch", addResearch);

  function researchObjId(res) {
    return {
      res: res.id,
    };
  }

  // server
  async function updateCollection(col, newAttr) {
    Object.assign(col, newAttr);
    const data = {
      type: "research",
      oper: "update_collection",
      id: { res: col.res },
      prop: {
        col: col.id,
        ...newAttr,
      },
    };

    const obj = await sendToServer(data);
  }
  provide("updateCollection", updateCollection);

  async function newCollection(res, newAttr) {
    const data = {
      type: "research",
      oper: "new_collection",
      id: researchObjId(res),
      prop: newAttr,
    };

    const obj = await sendToServer(data);
    res.collections.push(obj.data);
  }
  provide("newCollection", newCollection);

  async function resDeleteCollections(res, colList) {
    const data = {
      type: "research",
      oper: "delete_collections",
      id: researchObjId(res),
      prop: { colList },
    };

    console.log(data);
    const obj = await sendToServer(data);
  }
  provide("resDeleteCollections", resDeleteCollections);

  async function resLoadParts(researchObjId, sortAttr) {
    const data = {
      type: "research",
      oper: "get_prt_list",
      id: researchObjId,
      prop: sortAttr,
    };

    const obj = await sendToServer(data);
    return obj.data;
  }
  provide("resLoadParts", resLoadParts);

  async function resUpdateParts(researchObjId,partList,updAttr) {
    const data = {
      type: "research",
      oper: "update_parts",
      id: researchObjId,
      prop: {
        partList,
        updAttr,
      },
    };
    const obj = await sendToServer(data);
    loadResearchParts();
  }
  provide("resUpdateParts", resUpdateParts);

  async function resDuplicate(researchObjId,partList) {
    const data = {
      type: "research",
      oper: "duplicate",
      id: researchObjId,
      prop: {
        partList,
      },
    };
  
    const obj = await sendToServer(data);
    return obj.data.new_res;
  }
  provide("resDuplicate", resDuplicate);
  
  // return
  const resMethods = {
    getResearch,
    getCollection,
    updateCollection,
    newCollection,
    addResearch,
  };

  return [researches, resMethods];
}

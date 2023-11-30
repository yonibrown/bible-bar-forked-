import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useResearches(storeMethods, projId) {
  const researches = ref([]);
  provide("researches", researches);

  // local objects
  function getResearch(researchId) {
    const research = researches.value.find((pResearch) => {
      return pResearch.id == researchId;
    });
    return research;
  }

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

  function addResearch(res) {
    researches.value.push(res);
  }

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

  async function deleteCollections(res, colList) {
    const data = {
      type: "research",
      oper: "delete_collections",
      id: researchObjId(res),
      prop: { colList },
    };

    const obj = await sendToServer(data);
  }

  async function loadParts(res, sortAttr = { dummy: "" }) {
    const data = {
      type: "research",
      oper: "get_prt_list",
      id: researchObjId(res),
      prop: sortAttr,
    };

    const obj = await sendToServer(data);
    res.parts = obj.data;
  }

  async function updateParts(res, partList, updAttr) {
    const data = {
      type: "research",
      oper: "update_parts",
      id: researchObjId(res),
      prop: {
        partList,
        updAttr,
      },
    };
    const obj = await sendToServer(data);
    loadParts(res);
  }

  async function deleteParts(res, partList) {
    if (partList.length == 0){
      return;
    }
    const data = {
      type: "research",
      oper: "delete_parts",
      id: researchObjId(res),
      prop: {
        partList,
        project_id: { proj: projId },
      },
    };
    const obj = await sendToServer(data);
    loadParts(res);
    storeMethods.elm.reloadObjects(obj.data.objects_to_reload);
  }

  async function duplicate(researchObjId, partList) {
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

  async function loadIndexDivisions(seqIndex, selectedKey) {
    const data = {
      type: "res_index",
      oper: "get_divisions",
      id: seqIndex,
      prop: {
        key: selectedKey,
      },
    };

    const obj = await sendToServer(data);
    return obj.data;
  }

  async function loadIndex(seqIndex) {
    const data = {
      type: "res_index",
      oper: "get",
      id: seqIndex,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);

    return obj.data.levels;
  }

  async function newPart(res, prop) {
    prop.project_id = { proj: projId };
    const data = {
      type: "research",
      oper: "new_part",
      id: researchObjId(res),
      prop,
    };

    const obj = await sendToServer(data);
    res.parts.push(obj.data.new_part);
    storeMethods.elm.reloadObjects(obj.data.objects_to_reload);
  }

  // return
  const resMethods = {
    getResearch,
    getCollection,
    updateCollection,
    newCollection,
    addResearch,
    loadIndex,
    loadIndexDivisions,
    deleteCollections,
    loadParts,
    updateParts,
    deleteParts,
    duplicate,
    newPart,
  };
  provide("resMethods", resMethods);

  return [researches, resMethods];
}

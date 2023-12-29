import { provide } from "vue";
import { sendToServer } from "../../server.js";
import { biResearch } from "./biResearch.js";
import { biProject } from "./biProject.js";

export function useResearches() {
  // local objects
  function getResearch(researchId) {
    return biProject.main.getResearch(researchId);
  }

  function getCollection(researchId, colId) {
    return biResearch.getCollection(researchId, colId);
  }

  function addResearch(res) {
    biResearch.addResearch(res);
  }

  function getName(prop) {
    return biResearch.getName(prop);
  }

  // server
  function updateCollection(col, newAttr) {
    col.changeAttr(newAttr);
  }

  function newCollection(res, newAttr) {
    res.newCollection(newAttr);
  }

  function deleteCollections(res, colList) {
    res.deleteCollections(colList);
  }

  function uploadParts(res, prop) {
    res.uploadParts(prop);
  }

  function loadParts(res, sortAttr) {
    res.loadParts(sortAttr);
  }

  function updateParts(res, partList, updAttr) {
    res.updateParts(partList, updAttr);
  }

  function deleteParts(res, partList) {
    res.deleteParts(partList);
  }

  function duplicate(researchObjId, partList) {
    return biResearch.duplicate(researchObjId, partList);
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

  async function loadIndexLevels(seqIndex) {
    const data = {
      type: "res_index",
      oper: "get_levels",
      id: seqIndex,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);

    return obj.data;
  }

  async function newPart(res, prop) {
    res.newPart(prop);
  }

  // return
  const resMethods = {
    getResearch,
    getCollection,
    updateCollection,
    newCollection,
    addResearch,
    loadIndexLevels,
    loadIndexDivisions,
    deleteCollections,
    loadParts,
    updateParts,
    deleteParts,
    duplicate,
    newPart,
    getName,
    uploadParts,
  };
  provide("resMethods", resMethods);

  return [ resMethods];
}

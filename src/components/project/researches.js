import { provide } from "vue";
import { sendToServer } from "../../server.js";
import { biResearch } from "./biResearch.js";
import { biProject } from "./biProject.js";

export function useResearches() {
  // local objects
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

  // return
  const resMethods = {
    getCollection,
    addResearch,
    loadIndexLevels,
    loadIndexDivisions,
    duplicate,
    getName,
  };
  provide("resMethods", resMethods);

  return [ resMethods];
}

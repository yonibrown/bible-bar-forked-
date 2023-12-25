import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useResearches({ storeMethods, projId }) {
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

  function getName(prop) {
    let res = null;
    if (prop.id) {
      res = getResearch(prop.id);
    }
    if (prop.obj) {
      res = prop.obj;
    }
    if (!res) {
      return "research";
    }

    if (res.name != "") {
      return res.name;
    }
    return "research" + res.id;
  }

  // function reloadObj(id) {
  //   const res = getResearch(id);
  //   console.log('do nothing');
  // }

  // server
  async function changeAttr(res, attr) {
    const data = {
      type: "research",
      oper: "set",
      id: researchObjId(res),
      prop: attr,
    };

    const obj = await sendToServer(data);
  }

  async function setName(prop, newName) {
    let res = null;
    if (prop.id) {
      res = getResearch(prop.id);
    }
    if (prop.obj) {
      res = prop.obj;
    }
    if (!res) {
      console.log("Error: research not found");
      return;
    }

    res.name = newName;
    await changeAttr(res, { name: newName });
  }

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
    storeMethods.lnk.reloadResLink({ res: col.res });
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
    storeMethods.lnk.reloadResLink(researchObjId(res));
  }

  async function deleteCollections(res, colList) {
    const data = {
      type: "research",
      oper: "delete_collections",
      id: researchObjId(res),
      prop: { colList },
    };
    const obj = await sendToServer(data);
    await loadParts(res);
    loadCollections(res);
    storeMethods.lnk.reloadResLink(researchObjId(res));
  }

  async function uploadParts(res, prop) {
    const data = {
      type: "research",
      oper: "upload_parts",
      id: researchObjId(res),
      prop: { dummy: "" },
      file: prop.file,
    };

    const obj = await storeMethods.prj.sendToServer(data);
    res.collections.push(obj.data.new_collection);
    obj.data.new_parts.forEach(function(prt){
      res.parts.push(prt);
    });
    // await loadCollections(res);
    // loadParts(res);
    storeMethods.lnk.reloadResLink(researchObjId(res));
  }

  async function loadCollections(res) {
    const data = {
      type: "research",
      oper: "get_col_list",
      id: researchObjId(res),
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    res.collections = obj.data;
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
    const obj = await storeMethods.prj.sendToServer(data);
    loadParts(res);
  }

  async function deleteParts(res, partList) {
    if (partList.length == 0) {
      return;
    }
    const data = {
      type: "research",
      oper: "delete_parts",
      id: researchObjId(res),
      prop: {
        partList,
      },
    };
    const obj = await storeMethods.prj.sendToServer(data);
    loadParts(res);
    // storeMethods.elm.reloadObjects(obj.data.objects_to_reload);
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
    const data = {
      type: "research",
      oper: "new_part",
      id: researchObjId(res),
      prop,
    };

    const obj = await storeMethods.prj.sendToServer(data);
    obj.data.new_parts.forEach(function(prt){
      res.parts.push(prt);
    });
    // storeMethods.elm.reloadObjects(obj.data.objects_to_reload);
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
    // reloadObj,
    getName,
    setName,
    uploadParts,
  };
  provide("resMethods", resMethods);

  return [researches, resMethods];
}

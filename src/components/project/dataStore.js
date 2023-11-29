import { provide, ref } from "vue";
import { useResearches } from "./researches.js";
import { useElements } from "./elements.js";
import { useLinks } from "./links.js";
import { sendToServer } from "../../server.js";

export function newProjectData(projId) {
  const project = ref({
    id: projId,
    attr: {
      name: "---",
      desc: "",
    },
  });
  const storeMethods = {};

  const [researches, resMethods] = useResearches(storeMethods, projId);
  storeMethods.res = resMethods;

  const [elements, elmMethods] = useElements({ storeMethods, projId });
  storeMethods.elm = elmMethods;

  const [links, lnkMethods] = useLinks({ storeMethods, projId });
  storeMethods.lnk = lnkMethods;
  console.log(storeMethods);

  function projectObjId(proj) {
    return {
      proj: proj.id,
    };
  }

  async function loadProject() {
    const data = {
      type: "project",
      oper: "get",
      id: projectObjId(project.value),
      prop: { dummy: "" },
    };
    const obj = await sendToServer(data);
    project.value.attr = {
      name: obj.data.name,
      desc: obj.data.desc,
    };
    elements.value = obj.data.elements;
    links.value = obj.data.links;
    researches.value = obj.data.researches;
  }

  async function storeElementList(elements) {
    const data = {
      type: "project",
      oper: "save_elements",
      id: projectObjId(project.value),
      prop: { elements },
    };
    const obj = await sendToServer(data);
  }

  const prjMethods = {
    loadProject,
    storeElementList,
  };
  provide("prjMethods", prjMethods);

  return {
    project,
    prjMethods,
    researches,
    resMethods,
    elements,
    elmMethods,
    links,
  };
}

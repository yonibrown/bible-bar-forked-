import { ref } from "vue";
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
  const [researches, resMethods] = useResearches();
  const [elements, elmMethods] = useElements({ resMethods, projId });
  const [links, lnkMethods] = useLinks({ projId });

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

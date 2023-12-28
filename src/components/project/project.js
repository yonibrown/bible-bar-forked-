import { provide, ref } from "vue";
import { useResearches } from "./researches.js";
import { useElements } from "./elements.js";
import { useLinks } from "./links.js";
import { sendToServer } from "../../server.js";
import { biLink } from "./biLink.js";
import { biResearch } from "./biResearch";
import { biElement } from "./biElement";

export function newProjectData(projId) {
  const project = ref({
    id: projId,
    attr: {
      name: "---",
      desc: "",
    },
  });
  const storeMethods = {};

  biElement.setProjectId(projId);

  provide("elements", biElement.list);
  provide("researches", biResearch.list);
  provide("links", biLink.list);

  const [resMethods] = useResearches({ storeMethods, projId });
  storeMethods.res = resMethods;

  const [elmMethods] = useElements({ storeMethods, projId });
  storeMethods.elm = elmMethods;

  const [lnkMethods] = useLinks({ storeMethods, projId });
  storeMethods.lnk = lnkMethods;

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
    biElement.initList(obj.data.elements)
    biLink.initList(obj.data.links);
    biResearch.initList(obj.data.researches);
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

  async function prjSendToServer(data) {
    data.reload = projectObjId(project.value);
    const obj = await sendToServer(data);
    if (obj.objects_to_reload) {
      // obj.objects_to_reload.links.forEach(lnkMethods.reloadObj);
      // obj.objects_to_reload.researches.forEach(resMethods.reloadObj);
      obj.objects_to_reload.elements.forEach(elmMethods.reloadObj);
    }
    return obj;
  }

  function defaultName() {
    return "project" + project.value.id;
  }

  function getName() {
    if (project.value.attr.name.trim() == "") {
      return defaultName();
    }
    return project.value.attr.name;
  }

  async function changeName(newName) {
    changeAttr({ name: newName });
  }

  async function changeAttr(attr) {
    const data = {
      type: "project",
      oper: "set",
      id: projectObjId(project.value),
      prop: attr,
    };

    const obj = await sendToServer(data);
  }

  const prjMethods = {
    loadProject,
    storeElementList,
    sendToServer: prjSendToServer,
    defaultName,
    getName,
    changeName,
  };
  storeMethods.prj = prjMethods;
  provide("prjMethods", prjMethods);

  return {
    project,
    prjMethods,
    resMethods,
    elmMethods,
    elements: biElement.list
  };
}

import { provide, ref } from "vue";
import { useResearches } from "./researches.js";
import { useElements } from "./elements.js";
import { useLinks } from "./links.js";
import { sendToServer } from "../../server.js";
import { biLink } from "./biLink.js";

export function newProjectData(projId) {
  const project = ref({
    id: projId,
    attr: {
      name: "---",
      desc: "",
    },
  });
  const storeMethods = {};

  const [researches, resMethods] = useResearches({ storeMethods, projId });
  storeMethods.res = resMethods;

  const [elements, elmMethods] = useElements({ storeMethods, projId });
  storeMethods.elm = elmMethods;

  const [links, lnkMethods] = useLinks({ storeMethods, projId });
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
    elements.value = obj.data.elements;
    // links.value = obj.data.links;
    biLink.init(obj.data.links);
    researches.value = obj.data.researches;
    console.log(researches.value);
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
    researches,
    resMethods,
    elements,
    elmMethods,
    links,
  };
}

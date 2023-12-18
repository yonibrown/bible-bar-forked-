import { provide, ref } from "vue";
import { sendToServer } from "../server.js";

export function useProjectList() {
  const projects = ref([]);
  provide("projects", projects);

  //server
  async function loadProjects() {
    const data = {
      type: "project",
      oper: "get_list",
      id: { dummy: "" },
      prop: { dummy: "" },
    };
    const obj = await sendToServer(data);
    projects.value = obj.list;
  }

  async function newProject(prop) {
    const data = {
      type: "project",
      oper: "new",
      id: { dummy: "" },
      prop,
    };
    const obj = await sendToServer(data);
    return obj.id.proj;
  }

  // return
  const plistMethods = {
    loadProjects,
    newProject,
  };
  provide("plistMethods", plistMethods);

  return [projects, plistMethods];
}

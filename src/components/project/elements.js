import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useElements() {
  const elements = ref([]);
  provide("elements", elements);

  // access objects

  // access database
  async function elmCreate(projId, attr) {
    const data = {
      type: "element",
      oper: "new",
      id: { dummy: "" },
      prop: {
        proj: projId,
        ...attr,
      },
    };
    const obj = await sendToServer(data);
    return obj.data;
  }
  provide("elmCreate", elmCreate);

  // return
  const elmMethods = {
    elmCreate,
  };

  return [elements, elmMethods];
}

import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useElements({ resMethods, projId }) {
  const elements = ref([]);
  provide("elements", elements);

  // access objects

  // access database
  async function elmCreate(attr, options) {
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

    if (obj.data.res) {
      resMethods.addResearch(obj.data.res);
    }
    if (options && options.openingElement) {
      const elm = options.openingElement;
      if (elm.type == "new") {
        elm.type = attr.type;
        elm.id = obj.data.elm.id;
        elm.attr = obj.data.elm.attr;
      } else {
        // elements = elements.concat([data]);
        elements.value.push(obj.data.elm);
      }
    }
  }

  function createFromElement(attr, originalElement, name, nextPos) {
    const newAttr = { ...attr };
    const options = {};
    options.openingElement = originalElement;
    if (originalElement.type == "new") {
      newAttr.position = originalElement.position;
      newAttr.name = name;
    } else {
      newAttr.opening_element = originalElement.id;
      newAttr.name = "";
      newAttr.position = nextPos;
    }
    elmCreate(newAttr, options);
  }

  async function loadElement(elementObjId) {
    const data = {
      type: "element",
      oper: "get",
      id: elementObjId,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    return obj.data.attr;
  }

  async function loadBarSegments(elementObjId) {
    const data = {
      type: "element",
      oper: "get_segments",
      id: elementObjId,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    return obj.data.segments;
  }

  async function loadBarPoints(elementObjId) {
    const data = {
      type: "element",
      oper: "get_points",
      id: elementObjId,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    return obj.data.points;
  }

  async function changeAttr(elementObjId, attr) {
    const data = {
      type: "element",
      oper: "set",
      id: elementObjId,
      prop: attr,
    };

    const obj = await sendToServer(data);
  }

  async function loadText(elementObjId) {
    const data = {
      type: "element",
      oper: "get_segment",
      id: elementObjId,
      prop: { dummy: "" },
    };
  
    const obj = await sendToServer(data);
    return obj.data.part_list;
  }
  
  // return
  const elmMethods = {
    create: elmCreate,
    createFromElement,
    loadElement,
    changeAttr,
    loadBarSegments,
    loadBarPoints,
    loadText
  };
  provide("elmMethods", elmMethods);

  return [elements, elmMethods];
}

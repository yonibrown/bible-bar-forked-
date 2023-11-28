import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useElements({ resMethods, projId }) {
  const elements = ref([]);
  provide("elements", elements);

  // access objects
  function elementObjId(elm) {
    return {
      proj: elm.proj,
      elm: elm.id,
    };
  }


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

  async function loadElement(elm) {
    const data = {
      type: "element",
      oper: "get",
      id: elementObjId(elm),
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    return obj.data.attr;
  }

  async function loadBarSegments(elm) {
    const data = {
      type: "element",
      oper: "get_segments",
      id: elementObjId(elm),
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    elm.segments = obj.data.segments;
  }

  async function loadBarPoints(elm) {
    const data = {
      type: "element",
      oper: "get_points",
      id: elementObjId(elm),
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    elm.points = obj.data.points;
  }

  async function changeAttr(elm, attr) {
    const data = {
      type: "element",
      oper: "set",
      id: elementObjId(elm),
      prop: attr,
    };

    const obj = await sendToServer(data);
  }

  async function loadText(elm) {
    const data = {
      type: "element",
      oper: "get_segment",
      id: elementObjId(elm),
      prop: { dummy: "" },
    };
  
    const obj = await sendToServer(data);
    elm.verses = obj.data.part_list;
  }

  function reload(elm){
    if (elm.type == 'text'){
      loadText(elm);
    }
    if (elm.type == 'bar'){
      elm.points = [];
      loadBarSegments(elm);
      loadBarPoints(elm);
    }
  }
  
  // return
  const elmMethods = {
    create: elmCreate,
    createFromElement,
    loadElement,
    changeAttr,
    loadBarSegments,
    loadBarPoints,
    loadText,
    reload
  };
  provide("elmMethods", elmMethods);

  return [elements, elmMethods];
}

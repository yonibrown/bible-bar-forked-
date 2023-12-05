import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useElements({ storeMethods, projId }) {
  const elements = ref([]);
  provide("elements", elements);

  // access objects
  function getElement(elementId) {
    const element = elements.value.find((pElement) => {
      return pElement.id == elementId;
    });
    return element;
  }

  var tempElementId = -1;
  function openNewElement(position) {
    elements.value.push({
      id: tempElementId--,
      proj: projId,
      position,
      type: "new",
      name: "new element",
    });
  }

  function elementObjId(elm) {
    return {
      proj: elm.proj,
      elm: elm.id,
    };
  }

  function defaultName(elm) {
    if (elm.type == "link") {
      const link = storeMethods.lnk.getLink(elm.attr.link_id);
      return storeMethods.lnk.getName(link);
    }
    if (elm.type == "parts") {
      const res = storeMethods.res.getResearch(elm.attr.res);
      return storeMethods.res.getName(res);
    }
    if (elm.type == "new") {
      return "new element";
    }
    return "element" + elm.id;
  }

  function getName(elm) {
    if (elm.type == "link" || elm.type == "parts") {
      return defaultName(elm);
    }
    return elm.name;
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
      storeMethods.res.addResearch(obj.data.res);
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
    return obj.data.elm;
  }

  async function createFromElement(prop) {
    const newAttr = { ...prop.attr };
    const options = {};
    options.openingElement = prop.originalElement;
    if (prop.originalElement.type == "new") {
      newAttr.position = prop.originalElement.position;
      newAttr.name = prop.name;
    } else {
      newAttr.opening_element = prop.originalElement.id;
      newAttr.name = "";
      newAttr.position = prop.position;
    }
    const elm = await elmCreate(newAttr, options);

    prop.originalLinks.forEach(function (lnk) {
      lnk.elements.push(elm.id);
    });
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

  async function changeName(elm, newName) {
    // if (elm.type == "link") {
    //   const link = storeMethods.lnk.getLink(elm.attr.link_id);
    //   if (link) {
    //   }
    //   return;
    // }

    // if (elm.type == "parts") {
    //   const res = storeMethods.res.getResearch(elm.attr.res);
    //   if (res) {
    //   }
    //   return;
    // }

    changeAttr(elm, {
      name: newName,
    });
  }

  async function changeAttr(elm, attr) {
    const data = {
      type: "element",
      oper: "set",
      id: elementObjId(elm),
      prop: attr,
    };

    const obj = await storeMethods.prj.sendToServer(data);
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

  function reload(elm) {
    if (elm.type == "text") {
      loadText(elm);
    }
    if (elm.type == "bar") {
      elm.points = [];
      loadBarSegments(elm);
      loadBarPoints(elm);
    }
  }

  function reloadObj(obj) {
    const elm = getElement(obj.id);
    for (let act in obj.actions) {
      switch (act) {
        case "reload":
          reload(elm);
          break;
      }
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
    reloadObj,
    reload,
    openNewElement,
    defaultName,
    getName,
    changeName,
  };
  provide("elmMethods", elmMethods);

  return [elements, elmMethods];
}

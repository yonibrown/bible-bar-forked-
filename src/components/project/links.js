import { provide } from "vue";
import { sendToServer } from "../../server.js";
import { biLink } from "./biLink.js";

// class
export function useLinks({ storeMethods, projId }) {
  const links = biLink.links;
  provide("links", links);

  // access objects
  function getLink(prop) {
    return biLink.getLink(prop);
  }

  function getCategory(linkId, col) {
    return biLink.getCategory(linkId, col);
  }

  function linkObjId(link) {
    return {
      proj: link.proj,
      link: link.id,
    };
  }

  function getName(prop) {
    return biLink.getName(prop);
  }

  // function reloadObj(id) {
  //   const link = getLink({ id });
  //   console.log('do nothing');
  // }

  // access database
  async function setName(prop, newName) {
    biLink.setName(prop,newName);
  }

  async function updateCategory(link, cat, attr) {
    link.updateCategory(cat, attr);
  }

  async function addElementToLink(link, elmId) {
    if (!link.elements.includes(elmId)) {
      link.elements.push(elmId);
    }

    const data = {
      type: "link",
      oper: "add_elm",
      id: linkObjId(link),
      prop: { elm: elmId },
    };
    const obj = await storeMethods.prj.sendToServer(data);
    const elm = storeMethods.elm.getElement(elmId);
    storeMethods.elm.reload(elm, { add_link: true });
  }

  async function removeElementFromLink(link, elmId) {
    link.removeElementFromLink(elmId);
  }

  async function createLink(options) {
    const prop = {
      proj: projId,
      research_id: options.researchId,
      main_element: options.element.id,
    };

    const data = {
      type: "link",
      oper: "new",
      id: { dummy: "" },
      prop,
    };
    const obj = await sendToServer(data);

    links.value.push(obj.data);
    // options.element.verses = [];
    storeMethods.elm.reload(options.element);
  }

  function reload(link) {
    link.reload();
  }

  function reloadResLink(resIdObj) {
    const link = getLink(resIdObj);
    reload(link);
  }

  // return
  const lnkMethods = {
    updateCategory,
    getLink,
    addElementToLink,
    removeElementFromLink,
    getCategory,
    createLink,
    getName,
    setName,
    reloadResLink,
  };
  provide("lnkMethods", lnkMethods);

  return [links, lnkMethods];
}

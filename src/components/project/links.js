import { provide } from "vue";
import { sendToServer } from "../../server.js";
import { biLink } from "./biLink.js";

// class
export function useLinks({ storeMethods, projId }) {
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
  function updateCategory(link, cat, attr) {
    link.updateCategory(cat, attr);
  }

  function addElementToLink(link, elmId) {
    link.addElementToLink(elmId);
  }

  function removeElementFromLink(link, elmId) {
    link.removeElementFromLink(elmId);
  }

  function createLink(options) {
    biLink.createLink(options);
  }

  function reloadResLink(resIdObj) {
    biLink.reloadResLink(resIdObj);
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
    reloadResLink,
  };
  provide("lnkMethods", lnkMethods);

  return [lnkMethods];
}

import { provide } from "vue";
import { biElement } from "./biElement";
import { biProject } from "./biProject";

export function useElements() {
  // access objects
  function getElement(elementId) {
    return biProject.getElement(elementId);
  }

  function openNewElement(proj,position) {
    proj.openNewElement(position);
  }

  function defaultName(elm) {
    return elm.defaultName;
  }

  function getName(elm) {
    return elm.name;
  }

  // access database
  function elmCreate(attr, options) {
    return biElement.create(attr, options);
  }

  function createFromElement(prop) {
    biProject.main.createFromElement(prop);
  }

  function loadBarSegments(elm) {
    elm.loadSegments();
  }

  function loadBarPoints(elm) {
    elm.loadPoints();
  }

  function changeName(elm, newName) {
    elm.name = newName;
  }

  function changeAttr(elm, attr) {
    elm.changeAttr(attr);
  }

  function loadText(elm) {
    elm.loadText();
  }

  function reload(elm, attr) {
    elm.reload(attr);
  }

  function reloadObj(id) {
    const elm = biProject.getElement(id);
    elm.reload();
  }

  // return
  const elmMethods = {
    create: elmCreate,
    createFromElement,
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
    getElement,
  };
  provide("elmMethods", elmMethods);

  return [ elmMethods];
}

import { sendToServer } from "../../server.js";
import { biLink } from "./biLink";
import { biResearch } from "./biResearch.js";
import { biElement } from "./biElement";

export class biProject {
  static _project = null;

  constructor(id) {
    this._id = id;
    this._obj = {
      attr: {
        name: "---",
        desc: "",
      },
    };

    this._elements = [];
    this._links = [];
    this._researches = [];

    this._tempElementId = -1;

    this.constructor._project = this;
  }

  // getters

  static get main() {
    return this._project;
  }

  get id() {
    return this._id;
  }

  get dbId() {
    return { proj: this._id };
  }

  get attr() {
    return this._obj.attr;
  }

  get elements() {
    return this._elements;
  }

  get links() {
    return this._links;
  }

  get researches() {
    return this._researches;
  }

  // setters
  set attr(val) {
    this._obj.attr = val;
  }

  set elements(val) {
    this._elements = val;
  }

  set links(val) {
    this._links = val;
  }

  set researches(val) {
    this._researches = val;
  }

  //methods
  async loadProject() {
    const data = {
      type: "project",
      oper: "get",
      id: this.dbId,
      prop: { dummy: "" },
    };
    const obj = await sendToServer(data);
    this.attr = {
      name: obj.data.name,
      desc: obj.data.desc,
    };
    this._researches = biResearch.initList(obj.data.researches);
    this._elements = biElement.initList(obj.data.elements);
    this._links = biLink.initList(obj.data.links);
  }

  storeElementList(list) {
    const data = {
      type: "project",
      oper: "save_elements",
      id: this.dbId,
      prop: { list },
    };
    sendToServer(data);
  }

  defaultName() {
    return "project" + this.id;
  }

  getName() {
    if (this.attr.name.trim() == "") {
      return this.defaultName();
    }
    return this.attr.name;
  }

  changeName(newName) {
    this.changeAttr({ name: newName });
  }

  changeAttr(attr) {
    const data = {
      type: "project",
      oper: "set",
      id: this.dbId,
      prop: attr,
    };

    sendToServer(data);
  }

  openNewElement(position) {
    const newElement = biElement.init({
      id: this._tempElementId--,
      proj: this.id,
      position,
      type: "new",
      name: "new element",
    });
    this._elements.push(newElement);
  }

  getElement(elementId) {
    return this._elements.find((pElement) => {
      return pElement.id == elementId;
    });
  }

  async create(attr, options) {
    const data = {
      type: "element",
      oper: "new",
      id: { dummy: "" },
      prop: {
        proj: this.id,
        ...attr,
      },
    };
    const obj = await sendToServer(data);

    if (obj.data.res) {
      biResearch.addResearch(obj.data.res);
    }
    if (options && options.openingElement) {
      let elm = options.openingElement;
      if (elm.type == "new") {
        elm.type = attr.type;
        elm.id = obj.data.elm.id;
        elm.attr = obj.data.elm.attr;
      } else {
        elm = new biElement(obj.data.elm);
        this._elements.push(elm);
      }
    }
    return elm;
  }

  async createFromElement(prop) {
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
    const elm = await this.create(newAttr, options);

    prop.originalLinks.forEach(function (lnk) {
      lnk.elements.push(elm.id);
    });
  }

  getLink(prop) {
    if (prop.id) {
      return this._links.find(function (pLink) {
        return pLink.id == prop.id;
      });
    }
    if (prop.res) {
      return this._links.find(function (pLink) {
        return pLink.research_id == prop.res;
      });
    }
    return null;
  }

  async createLink(options) {
    const prop = {
      proj: this.id,
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

    this._links.push(new biLink(obj.data));
    options.element.reload();
  }

  addResearch(res) {
    this._researches.push(new biResearch(res));
  }

  getResearch(researchId) {
    return this._researches.find((pResearch) => {
      return pResearch.id == researchId;
    });
  }
}

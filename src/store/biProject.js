import { ref } from "vue";
import { sendToServer } from "../server.js";
import { biLink } from "./biLink.js";
import { biResearch } from "./biResearch.js";
import { biElement } from "./biElement.js";

export class biProject {
  static _project = null;

  constructor(id) {
    this._id = +id;
    this._obj = {
      attr: {
        name: "---",
        desc: "",
      },
    };

    this._elements = [];
    this._links = [];
    this._researches = [];
    this._tabs = [];

    this._tempElementId = -1;

    this.constructor._project = ref(this);
  }

  // getters

  static get main() {
    if (!this._project) {
      return null;
    }
    return this._project.value;
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

  get tabs() {
    return this._tabs;
  }

  get links() {
    return this._links;
  }

  get researches() {
    return this._researches;
  }

  get name() {
    if (this.attr.name.trim() == "") {
      return this.defaultName;
    }
    return this.attr.name;
  }

  get defaultName() {
    return "project" + this.id;
  }

  get primaryLink() {
    return this._obj.attr.primaryLink;
  }

  // setters
  // set attr(val) {
  //   this._obj.attr = val;
  // }

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
    this._obj.attr = {
      name: obj.data.name,
      desc: obj.data.desc,
      primaryLink: obj.data.primary_link,
    };

    this._researches = biResearch.initList(obj.data.researches);
    this._links = biLink.initList(obj.data.links);
    this._elements = biElement.initList(obj.data.elements);
    this._tabs = obj.data.tabs;
  }

  storeElementList(prop) {
    const data = {
      type: "project",
      oper: "save_elements",
      id: this.dbId,
      prop,
    };
    sendToServer(data);
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

  openNewElement(tab, position) {
    const newElement = biElement.init({
      id: this._tempElementId--,
      proj: this.id,
      tab,
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

  async createFromElement(prop) {
    const origElm = prop.originalElement;
    const newAttr = {
      proj: this.id,
      tab: origElm.tab,
      ...prop.attr,
    };
    if (origElm.type == "new") {
      newAttr.position = origElm.position;
      newAttr.name = prop.name;
    } else {
      newAttr.opening_element = origElm.id;
      newAttr.name = "";
      newAttr.position = prop.position;
    }
    const elm = await biElement.create(newAttr);

    if (origElm.type == "new") {
      // hide the element
      origElm.position = -1;
    }

    this._elements.push(elm);

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
    var newRes = this.getResearch(res.id);
    if (!newRes) {
      newRes = new biResearch(res);
      this._researches.push(newRes);
    }
    return newRes;
  }

  getResearch(researchId) {
    return this._researches.find((pResearch) => {
      return pResearch.id == researchId;
    });
  }

  reloadElements(list) {
    list.forEach((id) => {
      const elm = this.getElement(id);
      elm.reload();
    });
  }

  addTab() {
    let maxId = 0;
    this._tabs.forEach(function (tab) {
      tab.width_pct *= 0.8;
      maxId = Math.max(maxId, tab.id);
    });
    this._tabs.push({
      id: maxId + 1,
      width_pct: 20,
      type: "elements",
    });
  }
}

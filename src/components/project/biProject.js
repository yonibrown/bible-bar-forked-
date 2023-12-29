import { ref } from "vue";
import { sendToServer } from "../../server.js";
import { biLink } from "./biLink";
import { biResearch } from "./biResearch.js";
import { seqTitle } from "./sequence.js";
import { biElement } from "./biElement";

export class biProject {
  constructor(id) {
    this._id = id;
    this._obj = {
      attr: {
        name: "---",
        desc: "",
      },
      elements: null,
      links: null,
      researches: null
    };
  }

  // getters
  get id() {
    return this._id;
  }

  get dbId() {
    return {proj:this._id};
  }

  get attr() {
    return this._obj.attr;
  }
  
  get elements() {
    return this._obj.elements;
  }
  
  get links() {
    return this._obj.links;
  }
  
  get researches() {
    return this._obj.researches;
  }
  

  // setters
  set attr(val){
    this._obj.attr = val;
  }

  set elements(val){
    this._obj.elements = val;
  }

  set links(val){
    this._obj.links = val;
  }

  set researches(val){
    this._obj.researches = val;
  }

  //methods
  async loadProject() {
    const data = {
      type: "project",
      oper: "get",
      id: this.dbId,
      prop: { dummy: "" },
    };
    console.log(data);
    const obj = await sendToServer(data);
    console.log(obj);
    this.attr = {
      name: obj.data.name,
      desc: obj.data.desc,
    };
    this.elements = biElement.initList(obj.data.elements);
    this.links = biLink.initList(obj.data.links);
    this.researches = biResearch.initList(obj.data.researches);
  }

  storeElementList(elements) {
    const data = {
      type: "project",
      oper: "save_elements",
      id: this.dbId,
      prop: { elements },
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

  //static
}

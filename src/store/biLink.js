import { sendToServer } from "../server.js";
import { biProject } from "./biProject.js";

export class biLink {
  constructor(rec) {
    this._obj = rec;
    if (rec.research_id != 0) {
      this._research = biProject.main.getResearch(rec.research_id);
    }
  }

  // getters
  get id() {
    return this._obj.id;
  }

  get name() {
    const link = this._obj;
    if (link.research_id != 0) {
      return this._research.name;
    }
    if (link.name != "") {
      return link.name;
    }
    return "link" + link.id;
  }

  get categories() {
    return this._obj.categories;
  }

  get elements() {
    return this._obj.elements;
  }

  get proj() {
    return this._obj.proj;
  }

  get research_id() {
    return this._obj.research_id;
  }

  get dbId() {
    return {
      proj: this.proj,
      link: this.id,
    };
  }

  // setters
  set categories(obj) {
    this._obj.categories = obj;
  }

  set elements(obj) {
    this._obj.elements = obj;
  }

  set id(obj) {
    this._obj.id = obj;
  }

  setName(newName) {
    if (this.research_id != 0) {
      const res = biProject.main.getResearch(link.research_id);
      res.setName(newName);
      return;
    }

    this._obj.name = newName;
    this.changeAttr({ name: newName });
  }

  set proj(obj) {
    this._obj.proj = obj;
  }

  set research_id(obj) {
    this._obj.research_id = obj;
  }

  //methods
  getCategory(col) {
    const cat = this.categories.find((pCat) => {
      return pCat.col == col;
    });
    return cat;
  }

  async changeAttr(attr) {
    //toAdd: store new attr in object

    const data = {
      type: "link",
      oper: "set",
      id: this.dbId,
      prop: attr,
    };

    const obj = await sendToServer(data);
  }

  async updateCategory(cat, attr) {
    // update browser
    Object.assign(cat, attr);

    // update server
    const data = {
      type: "link",
      oper: "upd_cat",
      id: this.dbId,
      prop: {
        cat_id: cat,
        cat_attr: attr,
      },
    };
    const obj = await sendToServer(data);
  }

  async addResearch(res) {
    const data = {
      type: "link",
      oper: "add_cat",
      id: this.dbId,
      prop: { type: "research", data: res },
    };
    const obj = await sendToServer(data);
    this.reload();
  }

  async addElementToLink(elmId) {
    if (!this.elements.includes(elmId)) {
      this.elements.push(elmId);
    }

    const data = {
      type: "link",
      oper: "add_elm",
      id: this.dbId,
      prop: { elm: elmId },
    };
    const obj = await sendToServer(data);
    const elm = biProject.main.getElement(elmId);
    elm.reload({ add_link: true });
  }

  removeElementFromLink(elmId) {
    this.elements = this.elements.filter(function (arrElmId) {
      return arrElmId != elmId;
    });

    const data = {
      type: "link",
      oper: "remove_elm",
      id: this.dbId,
      prop: { elm: elmId },
    };
    sendToServer(data);
  }

  async reload() {
    const data = {
      type: "link",
      oper: "get",
      id: this.dbId,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    for (const attr in obj.data) {
      this._obj[attr] = obj.data[attr];
    }
  }

  //static
  static initList(list) {
    return list.map((rec) => {
      return new this(rec);
    });
  }

  static getCategory(linkId, col) {
    const link = biProject.main.getLink({ id: linkId });
    if (link == null) {
      return null;
    }
    return link.getCategory(col);
  }

  static reloadResLink(resIdObj) {
    const link = biProject.main.getLink(resIdObj);
    if (link) {
      link.reload();
    }
  }

  static createLink(options) {
    biProject.main.createLink(options);
  }
}

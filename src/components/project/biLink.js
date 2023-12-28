import { ref } from "vue";
import { sendToServer } from "../../server.js";
import { biResearch } from "./biResearch.js";

export class biLink {
  static _arr = ref([]);

  constructor(rec) {
    this._obj = rec;
  }

  // getters
  static get links() {
    return this._arr;
  }

  get id() {
    return this._obj.id;
  }

  get name() {
    const link = this._obj;
    if (link.research_id != 0) {
      return biResearch.getName({ id: link.research_id });
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

  set name(newName) {
    if (this.research_id != 0) {
      biResearch.setName({ id: link.research_id });
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
  static init(list) {
    // list.forEach(function (rec) {
    //   let obj = new biLink(rec);
    //   biLink.links.value.push(obj);
    // });
    biLink._arr.value = list.map(function (rec) {
      return new biLink(rec);
    });
  }

  static getLink(prop) {
    if (prop.id) {
      return biLink.links.value.find(function (pLink) {
        return pLink.id == prop.id;
      });
    }
    if (prop.res) {
      return biLink.links.value.find(function (pLink) {
        return pLink.research_id == prop.res;
      });
    }
    return null;
  }

  static getCategory(linkId, col) {
    const link = biLink.getLink({ id: linkId });
    if (link == null) {
      return null;
    }
    return link.getCategory(col);
  }

  static getName(prop) {
    let link = null;
    if (prop.id) {
      link = biLink.getLink({ id: prop.id });
    }
    if (prop.obj) {
      link = prop.obj;
    }
    if (!link) {
      return "link";
    }

    return link.name;
  }

  static async setName(prop, newName) {
    let link = null;
    if (prop.id) {
      link = biLink.getLink({ id: prop.id });
    }
    if (prop.obj) {
      link = prop.obj;
    }
    if (!link) {
      console.log("Error: link not found");
      return;
    }

    link.name = newName;
  }

  static reloadResLink(resIdObj) {
    const link = biLink.getLink(resIdObj);
    link.reload();
  }
}

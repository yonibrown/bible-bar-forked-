import { ref } from "vue";
import { sendToServer } from "../../server.js";
import { biLink } from "./biLink";

export class biResearch {
  static _arr = ref([]);

  constructor(rec) {
    this._obj = {
      id: rec.id,
      name: rec.name,
      collections: biResearchCollection.initList(rec.collections),
      parts: rec.parts,
    };
  }

  // getters
  static get list() {
    return this._arr;
  }

  get id() {
    return this._obj.id;
  }

  get name() {
    const res = this._obj;
    if (res.name != "") {
      return res.name;
    }
    return "research" + res.id;
  }

  get collections() {
    return this._obj.collections;
  }

  get parts() {
    return this._obj.parts;
  }

  get dbId() {
    return {
      res: this.id,
    };
  }

  // setters
  set collections(obj) {
    this._obj.collections = obj;
  }

  set parts(obj) {
    this._obj.parts = obj;
  }

  set name(newName) {
    this._obj.name = newName;
    this.changeAttr({ name: newName });
  }

  //methods
  changeAttr(attr) {
    //toAdd: store new attr in object

    const data = {
      type: "research",
      oper: "set",
      id: this.dbId,
      prop: attr,
    };

    sendToServer(data);
  }

  getCollection(colId) {
    const col = this.collections.find((pCol) => {
      return pCol.id == colId;
    });
    return col;
  }

  async newCollection(newAttr) {
    const data = {
      type: "research",
      oper: "new_collection",
      id: this.dbId,
      prop: newAttr,
    };

    const obj = await sendToServer(data);
    this.collections.push(new biResearchCollection(obj.data));
    biLink.reloadResLink(this.dbId);
  }

  async uploadParts(prop) {
    const data = {
      type: "research",
      oper: "upload_parts",
      id: this.dbId,
      prop: { dummy: "" },
      file: prop.file,
    };

    const obj = await sendToServer(data);
    this.collections.push(new biResearchCollection(obj.data.new_collection));
    obj.data.new_parts.forEach(function (prt) {
      this.parts.push(prt);
    });
    biLink.reloadResLink(this.dbId);
  }

  async loadCollections() {
    const data = {
      type: "research",
      oper: "get_col_list",
      id: this.dbId,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    this.collections = biResearchCollection.initList(obj.data);
  }

  async deleteCollections(colList) {
    const data = {
      type: "research",
      oper: "delete_collections",
      id: this.dbId,
      prop: { colList },
    };
    const obj = await sendToServer(data);
    await this.loadParts();
    this.loadCollections();
    biLink.reloadResLink(this.dbId);
  }

  async loadParts(sortAttr = { dummy: "" }) {
    const data = {
      type: "research",
      oper: "get_prt_list",
      id: this.dbId,
      prop: sortAttr,
    };

    const obj = await sendToServer(data);
    this.parts = obj.data;
  }

  async newPart(prop) {
    const data = {
      type: "research",
      oper: "new_part",
      id: this.dbId,
      prop,
    };

    const obj = await sendToServer(data);
    obj.data.new_parts.forEach(function (prt) {
      this.parts.push(prt);
    });
  }

  async updateParts(partList, updAttr) {
    const data = {
      type: "research",
      oper: "update_parts",
      id: this.dbId,
      prop: {
        partList,
        updAttr,
      },
    };
    const obj = await sendToServer(data);
    this.loadParts();
  }

  async deleteParts(partList) {
    if (partList.length == 0) {
      return;
    }
    const data = {
      type: "research",
      oper: "delete_parts",
      id: this.dbId,
      prop: {
        partList,
      },
    };
    const obj = await sendToServer(data);
    this.loadParts();
  }

  //static
  static initList(list) {
    const cls = this;
    this._arr.value = list.map(function (rec) {
      return new cls(rec);
    });
    return this._arr;
  }

  static addResearch(res) {
    this._arr.value.push(new biResearch(res));
  }

  static getResearch(researchId) {
    return this._arr.value.find((pResearch) => {
      return pResearch.id == researchId;
    });
  }

  static getCollection(researchId, colId) {
    const research = biResearch.getResearch(researchId);
    if (research == null) {
      return null;
    }
    return research.getCollection(colId);
  }

  static getName(prop) {
    let res = null;
    if (prop.id) {
      res = biResearch.getResearch(prop.id);
    }
    if (prop.obj) {
      res = prop.obj;
    }
    if (!res) {
      return "research";
    }

    return res.name;
  }

  static async duplicate(researchObjId, partList) {
    const data = {
      type: "research",
      oper: "duplicate",
      id: researchObjId,
      prop: {
        partList,
      },
    };

    const obj = await sendToServer(data);
    return obj.data.new_res;
  }
}

class biResearchCollection {
  constructor(rec) {
    this._obj = rec;
  }

  // getters
  get id() {
    return this._obj.id;
  }

  get name() {
    return this._obj.name;
  }

  get res() {
    return this._obj.res;
  }

  get dbId() {
    return {
      res: this.id,
    };
  }

  //methods
  async changeAttr(newAttr) {
    Object.assign(this._obj, newAttr);
    const data = {
      type: "research",
      oper: "update_collection",
      id: this.dbId,
      prop: {
        col: this.id,
        ...newAttr,
      },
    };

    const obj = await sendToServer(data);
    biLink.reloadResLink({ res: this.res });
  }

  static initList(list) {
    return list.map(function (rec) {
      return new biResearchCollection(rec);
    });
  }
}

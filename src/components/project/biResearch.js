import { ref } from "vue";
import { sendToServer } from "../../server.js";
import { biLink } from "./biLink";

export class biResearch {
  static _arr = ref([]);

  constructor(rec) {
    this._obj.id = rec.id;
    this._obj.name = rec.name;
    this._obj.collections = biResearchCollection.init(rec.collections);
    this._obj.parts = rec.parts;
  }

  // getters
  static get researches() {
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

  async newCollection(newAttr) {
    const data = {
      type: "research",
      oper: "new_collection",
      id: this.dbId,
      prop: newAttr,
    };

    const obj = await sendToServer(data);
    res.collections.push(new biResearchCollection(obj.data));
    biLink.reloadResLink(this.dbId);
  }

  //static
  static init(list) {
    // list.forEach(function (rec) {
    //   let obj = new biResearch(rec);
    //   biResearch._arr.value.push(obj);
    // });
    biResearch._arr.value = list.map(function (rec) {
      return new biResearch(rec);
    });
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

  static setName(prop, newName) {
    let res = null;
    if (prop.id) {
      res = biResearch.getResearch(prop.id);
    }
    if (prop.obj) {
      res = prop.obj;
    }
    if (!res) {
      console.log("Error: research not found");
      return;
    }

    res.name = newName;
  }
}

export class biResearchCollection {
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

  static init(list) {
    return list.map(function (rec) {
      return new biResearchCollection(rec);
    });
  }
}

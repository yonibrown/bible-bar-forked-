import { ref } from "vue";
import { sendToServer } from "../../server.js";

export class biResearch {
  static _arr = ref([]);

  constructor(rec) {
    this._obj = rec;
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

  //   get dbId() {
  //     return {
  //       proj: this.proj,
  //       link: this.id,
  //     };
  //   }

  // setters
  set name(newName) {
    if (this.research_id != 0) {
      console.log("not yet implemented");
      //   storeMethods.res.setName({ id: link.research_id });
      return;
    }

    this._obj.name = newName;
    this.changeAttr({ name: newName });
  }


  //methods

  //static
  static init(lnkList) {
    lnkList.forEach(function (linkRec) {
      let linkObj = new biLink(linkRec);
      biLink.links.value.push(linkObj);
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
}

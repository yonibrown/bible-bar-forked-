import { sendToServer } from "../server.js";
import { biLink } from "./biLink.js";
import { biProject } from "./biProject.js";

export class biResearch {
  constructor(rec) {
    this._obj = {
      id: rec.id,
      name: rec.name,
      collections: this.initCollections(rec.collections),
    };
    this._parts = this.initParts(rec.parts);
  }

  // getters
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
    return this._parts;
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

  // set parts(rec) {
  //   this._parts = this.initParts(rec);
  // }

  setName(newName) {
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
    this.collections.push(new biResearchCollection(obj.data, this));
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
    this.collections.push(
      new biResearchCollection(obj.data.new_collection, this),
    );
    obj.data.new_parts.forEach((prt) => {
      this._parts.push(new biResearchPart(prt, this));
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
    this._parts = this.initParts(obj.data);
  }

  async newPart(prop) {
    const data = {
      type: "research",
      oper: "new_part",
      id: this.dbId,
      prop,
    };

    const obj = await sendToServer(data);
    obj.data.new_parts.forEach((prt) => {
      this._parts.push(new biResearchPart(prt, this));
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

  async duplicate(partList) {
    const data = {
      type: "research",
      oper: "duplicate",
      id: this.dbId,
      prop: {
        partList,
      },
    };

    const obj = await sendToServer(data);
    const newRes = biProject.main.addResearch(obj.data.new_res);
    return newRes;
  }

  initCollections(list) {
    return list.map((rec) => {
      return new biResearchCollection(rec, this);
    });
  }

  initParts(list) {
    if (!list) {
      return [];
    }
    return list.map((rec) => {
      return new biResearchPart(rec, this);
    });
  }

  //static
  static initList(list) {
    return list.map((rec) => {
      return new this(rec);
    });
  }

  /* convert position/division to index key */
  static async getKey(seqIndex, prop) {
    const data = {
      type: "res_index",
      oper: "get_key",
      id: seqIndex,
      prop,
    };

    const obj = await sendToServer(data);
    return obj.data;
  }

  /* convert position to division */
  // static async getDivision(seqIndex, prop) {
  //   const data = {
  //     type: "res_index",
  //     oper: "get_division",
  //     id: seqIndex,
  //     prop,
  //   };

  //   const obj = await sendToServer(data);
  //   return obj.data;
  // }

  /* get divisions of every level acording to a position/division */
  static async getDivisions(seqIndex, prop) {
    const data = {
      type: "res_index",
      oper: "get_divisions",
      id: seqIndex,
      prop,
    };

    const obj = await sendToServer(data);
    return obj.data;
  }

  static async loadIndexLevels(seqIndex) {
    const data = {
      type: "res_index",
      oper: "get_levels",
      id: seqIndex,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);

    return obj.data;
  }

  static getReferenceStyles(){
    return [
      {
        value: 0,
        label: "מלכים א יח יב",
        nameIdxArr: [1,1,1]
      },
      {
        value: 1,
        label: 'מלכים א\' י"ח י"ב',
        nameIdxArr: [1,1,1]
      },
      {
        value: 2,
        label: 'מל"א יח 12',
        nameIdxArr: [2,1,0]
      },
    ];
  }
}

class biResearchCollection {
  constructor(rec, research) {
    this._obj = rec;
    this._res = research;
  }

  // getters
  get id() {
    return this._obj.id;
  }

  get name() {
    return this._obj.name;
  }

  get description() {
    return this._obj.description;
  }

  get res() {
    return this._obj.res;
  }

  get dbId() {
    return {
      res: this.res,
    };
  }

  get parts() {
    return this._res.parts.filter((prt) => {
      return prt.col == this.id;
    });
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

  // static initList(list) {
  //   return list.map(function (rec) {
  //     return new biResearchCollection(rec);
  //   });
  // }
}

class biResearchPart {
  constructor(rec, research) {
    this._obj = rec;
    this._res = research;
  }

  // getters
  get id() {
    return this._obj.id;
  }

  get sort_key() {
    return this._obj.sort_key;
  }

  get col() {
    return this._obj.col;
  }

  get col_name() {
    return this._obj.col_name;
  }

  get src_collection() {
    return this._obj.src_collection;
  }

  get src_from_name() {
    return this._obj.src_from_name;
  }

  get src_from_position() {
    return this._obj.src_from_position;
  }

  get src_from_text() {
    return this._obj.src_from_text;
  }

  get src_from_word() {
    return this._obj.src_from_word;
  }

  get src_name() {
    return this._obj.src_name;
  }

  get src_research() {
    return this._obj.src_research;
  }

  get src_to_name() {
    return this._obj.src_to_name;
  }

  get src_to_position() {
    return this._obj.src_to_position;
  }

  get src_to_text() {
    return this._obj.src_to_text;
  }

  get src_to_word() {
    return this._obj.src_to_word;
  }

  get src_to_word_count() {
    return this._obj.src_to_word_count;
  }

  get text_after() {
    return this._obj.text_after;
  }

  get text_before() {
    return this._obj.text_before;
  }

  get text_part() {
    return this._obj.text_part;
  }

  get dbId() {
    return {
      res: this._res.id,
    };
  }

  //methods
  changeAttr(newAttr) {
    this._res.updateParts([this.id], newAttr);
  }
}

// function splitTextToWords(text){
//   return props.text
//     .replaceAll(/[\s־׃]/g, (ch) => {
//       return ch + "w";
//     })
//     .split("w");
// }

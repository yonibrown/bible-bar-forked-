import { sendToServer } from "../../server.js";
import { biLink } from "./biLink";
import { biResearch } from "./biResearch.js";

export class biElement {
  constructor(rec) {
    this._obj = rec;
  }

  // getters
  get id() {
    return this._obj.id;
  }

  get proj() {
    return this._obj.proj;
  }

  get type() {
    return this._obj.type;
  }

  get attr() {
    return this._obj.attr;
  }

  get position() {
    return this._obj.position;
  }

  get defaultName() {
    return "element" + this.id;
  }

  get name() {
    if (this._obj.name.trim() == "") {
      return this.defaultName;
    }
    return this._obj.name;
  }

  get dbId() {
    return {
      proj: this.proj,
      elm: this.id,
    };
  }

  // setters
  set id(obj) {
    this._obj.id = obj;
  }

  set type(obj) {
    this._obj.type = obj;
  }

  set attr(obj) {
    this._obj.attr = obj;
  }

  set position(obj) {
    this._obj.position = obj;
  }

  //methods
  setName(newName){
    this._obj.name = newName;
    this.changeAttr({ name: newName });
  }


  async changeAttr(attr) {
    const data = {
      type: "element",
      oper: "set",
      id: this.dbId,
      prop: attr,
    };

    const obj = await sendToServer(data);
    this.attr = obj.data.attr;

    this.reload(attr);
  }

  reload(attr) {
    //do nothing
  }

  //static
  static initList(list) {
    return list.map((rec) => {
      return this.init(rec);
    });
  }

  static init(rec) {
    switch (rec.type) {
      case "new":
        return new biElmNew(rec);
      case "bar":
        return new biElmBar(rec);
      case "text":
        return new biElmText(rec);
      case "parts":
        return new biElmParts(rec);
      case "link":
        return new biElmLink(rec);
    }
  }

  static reloadObj(id) {
    const elm = this.getElement(id);
    elm.reload();
  }

  static seqTitle(key) {
    let nameKey = key.map(function (lvl) {
      return lvl.name;
    });
    return nameKey.join(" ");
  }
}

class biElmBar extends biElement {
  // constructor(rec){

  // }

  //getters
  get segments() {
    return this._segments;
  }

  get points() {
    return this._points;
  }

  //methods
  async loadSegments() {
    const data = {
      type: "element",
      oper: "get_segments",
      id: this.dbId,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    this._segments = obj.data.segments;
  }

  async loadPoints() {
    const data = {
      type: "element",
      oper: "get_points",
      id: this.dbId,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    this._points = obj.data.points;
  }

  reload(attr) {
    if (
      !attr ||
      "from_div" in attr ||
      "to_div" in attr ||
      "seq_level" in attr
    ) {
      this.loadSegments();
    }

    if (!attr || "from_div" in attr || "to_div" in attr || "add_link" in attr) {
      this._points = [];
      this.loadPoints();
    }
  }
}

class biElmNew extends biElement {
  get defaultName() {
    return "new element";
  }
  changeAttr(attr) {
    // do nothing
  }
}
class biElmText extends biElement {
  get defaultName() {
    return biElement.seqTitle(this.attr.from_key);
  }
  get verses() {
    return this._verses;
  }
  async loadText() {
    const data = {
      type: "element",
      oper: "get_segment",
      id: this.dbId,
      prop: { dummy: "" },
    };

    const obj = await sendToServer(data);
    this._verses = obj.data.part_list;
  }
  reload(attr) {
    if (
      !attr ||
      "point_research_id" in attr ||
      "point_part_id" in attr ||
      "division_id" in attr ||
      "from_div" in attr ||
      "to_div" in attr ||
      "add_link" in attr
    ) {
      elm.loadText();
    }
  }
}
class biElmParts extends biElement {
  get defaultName() {
    return biResearch.getName({ id: this.attr.res });
  }

  get name() {
    return this.defaultName;
  }

  set name(newName) {
    const res = biResearch.getResearch(this.attr.res);
    res.name = newName;
  }
}
class biElmLink extends biElement {
  get defaultName() {
    return biLink.getName({ id: this.attr.link_id });
  }

  get name() {
    return this.defaultName;
  }

  set name(newName) {
    const link = biLink.getLink({ id: this.attr.link_id });
    link.name = newName;
  }
}

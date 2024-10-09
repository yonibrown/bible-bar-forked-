import { sendToServer } from "../server.js";
import { biProject } from "./biProject.js";

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

  get tab() {
    return this._obj.tab;
  }

  get position() {
    return this._obj.position;
  }

  get yAddition() {
    return this._obj.y_addition;
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

  get numbering() {
    return this.attr.numbering;
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

  set tab(obj) {
    this._obj.tab = obj;
  }

  //methods
  setName(newName) {
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
      case "board":
        return new biElmBoard(rec);
    }
  }

  static async create(prop) {
    const data = {
      type: "element",
      oper: "new",
      id: { dummy: "" },
      prop,
    };
    const obj = await sendToServer(data);

    if (obj.data.res) {
      biProject.main.addResearch(obj.data.res);
    }

    const elm = this.init(obj.data.elm);
    return elm;
  }

  static seqTitle(key) {
    let nameKey = key.map(function (lvl) {
      return lvl.name;
    });
    return nameKey.join(" ");
  }
}

class biElmBar extends biElement {
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
      "seq_level" in attr ||
      "division_id" in attr
    ) {
      this._segments = [];
      this.loadSegments();
    }

    if (
      !attr ||
      "from_div" in attr ||
      "to_div" in attr ||
      "add_link" in attr ||
      "division_id" in attr
    ) {
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
      "division_id" in attr ||
      "from_div" in attr ||
      "to_div" in attr
    ) {
      this.loadText();
    }
  }
}

class biElmParts extends biElement {
  constructor(rec) {
    super(rec);
    this._research = biProject.main.getResearch(this.attr.res);
    this._partsWidth = [this.attr.col_width, this.attr.src_width];
  }

  get defaultName() {
    return this._research.name;
  }

  get name() {
    return this.defaultName;
  }

  setName(newName) {
    this._research.setName(newName);
  }

  partsWidth(idx) {
    return this._partsWidth[idx];
  }
}

class biElmLink extends biElement {
  constructor(rec) {
    super(rec);
    this._link = biProject.main.getLink({ id: this.attr.link_id });
  }

  get defaultName() {
    return this._link.name;
  }

  get name() {
    return this.defaultName;
  }

  setName(newName) {
    this._link.setName(newName);
  }
}

class biElmBoard extends biElement {
  constructor(rec) {
    super(rec);
    this._lines = this.initLines(rec.attr.lines);
  }

  get fields() {
    return this.attr.fields;
  }

  get lines() {
    return this._lines;
  }

  initLines(list) {
    return list.map((rec) => {
      return new biBoardLine(rec, this);
    });
  }

  async addLine(attr) {
    const data = {
      type: "board",
      oper: "add_line",
      id: this.dbId,
      prop: attr,
    };

    const obj = await sendToServer(data);
    this._lines.push(new biBoardLine(obj.rec, this));
  }

  // setFieldPosition(attr) {
  //   let fld = this.fields.find(function (fld1) {
  //     return fld1.id == attr.id;
  //   });

  //   fld.position = attr.newPos;
  // }

  async setField(attr) {
    const data = {
      type: "set_field",
      oper: "set",
      id: this.dbId,
      prop: attr,
    };

    const obj = await sendToServer(data);
  }
}

class biBoardLine {
  constructor(rec, board) {
    this._id = rec.id;
    this._position = rec.position;
    this._board = board;
    this._content = this.initContent(rec.content);
  }

  get id() {
    return this._id;
  }

  get position() {
    return this._position;
  }

  get proj() {
    return this._board.proj;
  }

  get elm() {
    return this._board.id;
  }

  get dbId() {
    return {
      proj: this.proj,
      elm: this.elm,
      line: this.id,
    };
  }

  sortKey(fldId) {
    return this.content(fldId).sortKey;
  }

  content(fldId) {
    return this._content.find(function (fld) {
      return fld.id == fldId;
    });
  }

  initContent(list) {
    return list.map((rec) => {
      return new biBoardContent(rec, this);
    });
  }

  async addContent(attr) {
    this._content.push(new biBoardContent(attr, this));
    const data = {
      type: "brd_line",
      oper: "new_content",
      id: this.dbId,
      prop: attr,
    };

    const obj = await sendToServer(data);
  }

  delete() {
    this._position = 0;
    this.changeAttr({ position: 0 });
  }

  async changeAttr(attr) {
    const data = {
      type: "brd_line",
      oper: "set",
      id: this.dbId,
      prop: attr,
    };

    const obj = await sendToServer(data);
  }
}

class biBoardContent {
  constructor(rec, line) {
    this._id = rec.field;
    this._text = rec.text;
    this._line = line;
  }

  get id() {
    return this._id;
  }

  get proj() {
    return this._line.proj;
  }

  get elm() {
    return this._line.elm;
  }

  get lineId() {
    return this._line.id;
  }

  get text() {
    return this._text;
  }

  get sortKey() {
    return this.text;
  }

  get dbId() {
    return {
      proj: this.proj,
      elm: this.elm,
      line: this.lineId,
      field: this.id,
    };
  }

  async changeAttr(attr) {
    if (typeof attr.text != "undefined") {
      this._text = attr.text;
    }
    const data = {
      type: "brd_content",
      oper: "set",
      id: this.dbId,
      prop: attr,
    };

    const obj = await sendToServer(data);
  }
}

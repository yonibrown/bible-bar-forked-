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
    this._fields = this.initFields(rec.attr.fields);
    this._lines = this.initLines(rec.attr.lines);
  }

  get fields() {
    return this._fields;
  }

  get lines() {
    return this._lines;
  }

  initFields(list) {
    return list.map((rec) => {
      return new biBoardField(rec, this);
    });
  }

  initLines(list) {
    return list.map((rec) => {
      return new biBoardLine(rec, this);
    });
  }

  getField(fldId) {
    return this._fields.find(function (fld) {
      return fld.id == fldId;
    });
  }

  setField(fldId, attr) {
    this.getField(fldId).changeAttr(attr);
  }

  async addLine(attr) {
    const data = {
      type: "board",
      oper: "add_line",
      id: this.dbId,
      prop: attr,
    };

    const obj = await sendToServer(data);
    this._lines.push(new biBoardLine(obj.data, this));
  }

  async addField(attr) {
    const fieldProp = {
      position: attr.position,
      type: attr.fieldType,
    };
    if (attr.fieldType == "SourceWord") {
      fieldProp.parent_field = attr.openingField.id;
    }
    const data = {
      type: "board",
      oper: "add_field",
      id: this.dbId,
      prop: fieldProp,
    };

    const obj = await sendToServer(data);
    this._fields.push(new biBoardField(obj.data, this));
  }

  sortLines(attr) {
    // filter out deleted lines
    const arr = this._lines.filter(function (line) {
      return line.position > 0;
    });

    //sort
    arr.sort(function (a, b) {
      return (attr.ascending &&
        a.sortKey(attr.fldId) > b.sortKey(attr.fldId)) ||
        (!attr.ascending && a.sortKey(attr.fldId) < b.sortKey(attr.fldId))
        ? 1
        : -1;
    });

    arr.forEach((line, idx) => {
      line.setPosition(idx + 1);
    });

    // save filtered array (optional)
    this._lines = arr;
  }
}

class biBoardField {
  constructor(rec, board) {
    this._id = rec.id;
    this._position = rec.position;
    this._board = board;
    this._title = rec.title;
    this._type = rec.type;
    this._text = rec.text;
    this._widthPct = rec.width_pct;
    this._parentField = rec.parent_field;
    this._displayWholeVerse = rec.display_whole_verse;
    this._referenceStyle = rec.reference_style;
    this._src_research = rec.src_research;
    this._src_collection = rec.src_collection;
    this._sec_index = rec.sec_index;
  }

  get id() {
    return this._id;
  }

  get position() {
    return this._position;
  }

  get title() {
    return this._title;
  }

  get type() {
    return this._type;
  }

  get text() {
    return this._text;
  }

  get widthPct() {
    return this._widthPct;
  }

  get parentField() {
    return this._parentField;
  }

  get displayWholeVerse() {
    return this.getParent()._displayWholeVerse;
  }

  get referenceStyle() {
    return this.getParent()._referenceStyle;
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
      field: this.id,
    };
  }

  getParent() {
    if (this.id == this.parentField) {
      return this;
    }
    return this._board.getField(this.parentField);
  }

  setPosition(position) {
    this._position = position;
    this.changeAttr({ position });
  }

  delete() {
    this.setPosition(0);
  }

  async changeAttr(attr) {
    if (typeof attr.title != "undefined") {
      this._title = attr.title;
    }
    if (typeof attr.display_whole_verse != "undefined") {
      if (this.id != this.parentField) {
        this.getParent().changeAttr(attr);
        return;
      }
      this._displayWholeVerse = attr.display_whole_verse;
    }
    if (typeof attr.reference_style != "undefined") {
      if (this.id != this.parentField) {
        this.getParent().changeAttr(attr);
        return;
      }
      this._referenceStyle = attr.reference_style;
    }

    const data = {
      type: "brd_field",
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
    const cnt = this.content(fldId);
    if (cnt) {
      return cnt.sortKey;
    }
    return "";
  }

  content(fldId) {
    let searchFieldId = null;
    const field = this._board.getField(fldId);
    if (field.parentField == fldId) {
      searchFieldId = fldId;
    } else {
      searchFieldId = field.parentField;
    }
    return this._content.find(function (fld) {
      return fld.id == searchFieldId;
    });
  }

  initContent(list) {
    return list.map((rec) => {
      return new biBoardContent(rec, this);
    });
  }

  async addContent(attr) {
    this._content.push(
      new biBoardContent({ field: attr.field, ...attr.content }, this)
    );
    const data = {
      type: "brd_line",
      oper: "new_content",
      id: this.dbId,
      prop: attr,
    };

    const obj = await sendToServer(data);
  }

  delete() {
    this.setPosition(0);
  }

  setPosition(position) {
    this._position = position;
    this.changeAttr({ position });
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

    this._src_from_division = +rec.src_from_division;
    this._src_from_word = +rec.src_from_word;
    this._src_from_name = rec.src_from_name;
    this._src_to_division = +rec.src_to_division;
    this._src_to_word = +rec.src_to_word;
    this._src_to_name = rec.src_to_name;
    this._gen_from_position = +rec.gen_from_position;
    this._gen_to_position = +rec.gen_to_position;
    this._gen_from_text = rec.gen_from_text;
    this._gen_to_text = rec.gen_to_text;

    this._line = line;
    this._field = line._board.getField(rec.field);
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

  get type() {
    return this._field.type;
  }

  get displayWholeVerse() {
    return this._field.displayWholeVerse;
  }

  get referenceStyle() {
    return this._field.referenceStyle;
  }

  get val() {
    switch (this.type) {
      case "SourceVerse":
        return {
          src_research: this._field._src_research,
          src_collection: this._field._src_collection,
          src_index: this._field._src_index,
          src_from_division: this._src_from_division,
          src_from_word: this._src_from_word,
          src_from_name: this._src_from_name,
          src_to_division: this._src_to_division,
          src_to_word: this._src_to_word,
          src_to_name: this._src_to_name,
          src_from_position: this._gen_from_position,
          src_to_position: this._gen_to_position,
          src_from_text: this._gen_from_text,
          src_to_text: this._gen_to_text,
        };
    }
    // default (this.type == 'FreeText')
    return this._text;
  }

  get sortKey() {
    return this.val;
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
    if (typeof attr.src_from_division != "undefined") {
      this._src_from_division = attr.src_from_division;
    }
    if (typeof attr.src_from_word != "undefined") {
      this._src_from_word = attr.src_from_word;
    }
    if (typeof attr.src_from_name != "undefined") {
      this._src_from_name = attr.src_from_name;
    }
    if (typeof attr.src_to_division != "undefined") {
      this._src_to_division = attr.src_to_division;
    }
    if (typeof attr.src_to_word != "undefined") {
      this._src_to_word = attr.src_to_word;
    }
    if (typeof attr.src_to_name != "undefined") {
      this._src_to_name = attr.src_to_name;
    }

    const data = {
      type: "brd_content",
      oper: "set",
      id: this.dbId,
      prop: attr,
    };

    const obj = await sendToServer(data);

    // update generated values
    this._gen_from_position = +obj.data.gen_from_position;
    this._gen_to_position = +obj.data.gen_to_position;
    this._gen_from_text = obj.data.gen_from_text;
    this._gen_to_text = obj.data.gen_to_text;
  }
}

import { sendToServer } from "../server.js";
export class biSource {
  constructor(id) {
    this._id = id;
    this._books = [];
    this.loadBooks();
  }

  get id() {
    return this._id;
  }

  get dbId() {
    return { source_id: this._id };
  }

  get books() {
    return this._books;
  }

  loadKeyLevel(prop){
    if (prop.level == 'book'){
      console.log('get books',this._books);
      return this._books;
    }

    return [
      { id: 1, name: "א" },
      { id: 2, name: "ב" },
      { id: 3, name: "ג" },
    ];
  }

  async loadBooks() {
    const data = {
      type: "source",
      oper: "get_books",
      id: this.dbId,
      prop: { dummy: null },
    };
    const obj = await sendToServer(data);
    this._books = obj.data;
    console.log('set books',this._books);
  }

  static initList(list) {
    return list.map((rec) => {
      return new this(rec);
    });
  }
}

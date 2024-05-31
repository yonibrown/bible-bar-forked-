import { sendToServer } from "../server.js";
export class biSource {
  static async loadKeyLevel(prop) {

    this.constructor._books = [
      { id: 1, name: "בראשית" },
      { id: 2, name: "שמות" },
    ];

    if (prop.level == "book") {
      if (this.constructor._books) {
        return this.constructor._books;
      }
    }

    const data = {
      type: "source",
      oper: "get_level",
      id: { dummy: 0 },
      prop,
    };
    const obj = await sendToServer(data);

    if (prop.level == "book") {
      this.constructor._books = obj.data;
    }

    return obj.data;
  }
}

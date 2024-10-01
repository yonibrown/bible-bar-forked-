export function writeToClipboard(htmlElm, type = "html") {
  if (type == "html") {
    const blob = new Blob([htmlElm], { type: "text/html" });
    const clipboardItem = new window.ClipboardItem({ "text/html": blob });
    navigator.clipboard.write([clipboardItem]);
    return;
    // var r = document.createRange();
    // r.selectNode(textRef.value);
    // window.getSelection().removeAllRanges();
    // window.getSelection().addRange(r);
    // document.execCommand("copy");
    // window.getSelection().removeAllRanges();
  }
  if (type == "png") {
    html2canvas(htmlElm).then((canvas) => {
      // var imgageData = canvas.targetURL("image/png");
      // var newData = imgageData.replace(
      //   /^data:image\/png/,
      //   "data:application/octet-stream"
      // );

      // download
      // var element = document.createElement("a");
      // element.setAttribute("href", newData);
      // element.setAttribute("download", "bar.png");
      // document.body.appendChild(element);
      // element.click();
      // document.body.removeChild(element);

      //copy to clipboard
      canvas.toBlob(function (blob) {
        navigator.clipboard
          .write([
            new ClipboardItem(
              Object.defineProperty({}, blob.type, {
                value: blob,
                enumerable: true,
              })
            ),
          ])
          .then(function () {
            // do something
          });
      });

      // barBodyRef.value.appendChild(canvas);
    });
    return;
  }
}

export class positioning {
  constructor(attr) {
    this._attr = attr;
    this._elements = attr.elements;
    this._saveElmList = attr.saveElmList;
  }

  get elements() {
    return this._elements.value;
  }

  getElement(idx) {
    return this.elements.find((pElement) => {
      return pElement.id == idx;
    });
  }

  move(source, target) {
    const sourceElm = this.elements[source.idx];
    const sourceElmPos = +sourceElm.position;
    const targetElm = this.elements[target.idx];
    const targetElmPos = +targetElm.position;
    // const sourceElm = this.getElement(source.id);
    // const targetElm = this.getElement(target.id);

    if (target.tab == source.tab) {
      // same tab
      if (target.idx == source.idx) {
        // nothing to move
        return;
      }

      if (Math.abs(target.idx - source.idx) == 1) {
        // switch following items
        sourceElm.position = +targetElmPos;
        targetElm.position = +sourceElmPos;
        this._saveElmList();
        return;
      }
    }

    sourceElm.position = this.prevPos(target.idx);
    sourceElm.tab = target.tab;
    this._saveElmList();
  }

  prevPos(idx) {
    if (this.elements == 0) {
      return 1;
    }
    const elm = this.elements[idx];
    const elmPos = +elm.position;
    var prevElmPos = 0;
    if (idx > 0) {
      prevElmPos = +this.elements[idx - 1].position;
    }
    return (elmPos - prevElmPos) / 2 + prevElmPos;
  }

  nextPos(idx) {
    const elm = this.elements[idx];
    const elmPos = +elm.position;
    var nextElmPos = elmPos + 2;
    if (idx < this.elements.length - 1) {
      nextElmPos = +this.elements[idx + 1].position;
    }
    return (nextElmPos - elmPos) / 2 + elmPos;
  }
}

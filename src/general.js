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

export class ordering {
  constructor(attr) {
    this._getSize = attr.getSize;
    this._getPosition = attr.getPosition;
    this._setTab = attr.setTab;
    this._commitChanges = attr.commitChanges;
    this._getItem = attr.getItem;
    this._setItemPosition = attr.setPosition;
  }

  move(attr) {
    if (attr.steps) {
      attr.target = {
        idx: attr.source.idx + attr.steps,
      };
    }
    const sourceElmPos = this._getPosition(attr.source.idx);
    const targetElmPos = this._getPosition(attr.target.idx);

    if (attr.target.tab == attr.source.tab) {
      // same tab
      if (attr.target.idx == attr.source.idx) {
        // nothing to move
        return;
      }

      if (Math.abs(attr.target.idx - attr.source.idx) == 1) {
        // switch following items
        this.setPosition([
          { idx: attr.source.idx, newVal: targetElmPos },
          { idx: attr.target.idx, newVal: sourceElmPos },
        ]);
        this._commitChanges();
        return;
      }
    }

    this.setPosition([
      { idx: attr.source.idx, newVal: this.prevPos(attr.target.idx) },
    ]);
    this._setTab(attr.source.idx, attr.target.tab);
    this._commitChanges();
  }

  setPosition(parms) {
    let act = [];
    parms.forEach(({ idx, newVal }) => {
      act.push({ item: this._getItem(idx), newVal });
    });
    act.forEach(({ item, newVal }) => {
      this._setItemPosition(item, newVal);
    });
  }

  prevPos(idx) {
    if (this._getSize() == 0) {
      return 1;
    }
    const elmPos = this._getPosition(idx);
    var prevElmPos = 0;
    if (idx > 0) {
      prevElmPos = this._getPosition(idx - 1);
    }
    return (elmPos - prevElmPos) / 2 + prevElmPos;
  }

  nextPos(idx) {
    const elmPos = this._getPosition(idx);
    var nextElmPos = elmPos + 2;
    if (idx < this._getSize() - 1) {
      nextElmPos = this._getPosition(idx + 1);
    }
    return (nextElmPos - elmPos) / 2 + elmPos;
  }
}

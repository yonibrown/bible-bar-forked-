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
    this._setPosition = attr.setPosition;
    this._setTab = attr.setTab;
    this._saveElmList = attr.saveElmList;
  }

  move(source, target) {
    const sourceElmPos = this._getPosition(source.idx);
    const targetElmPos = this._getPosition(target.idx);

    if (target.tab == source.tab) {
      // same tab
      if (target.idx == source.idx) {
        // nothing to move
        return;
      }

      if (Math.abs(target.idx - source.idx) == 1) {
        // switch following items
        this._setPosition([
          { idx: source.idx, newVal: targetElmPos },
          { idx: target.idx, newVal: sourceElmPos },
        ]);
        this._saveElmList();
        return;
      }
    }

    this._setPosition([{ idx: source.idx, newVal: this.prevPos(target.idx) }]);
    this._setTab(source.idx, target.tab);
    this._saveElmList();
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

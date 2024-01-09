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
      // var imgageData = canvas.toDataURL("image/png");
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

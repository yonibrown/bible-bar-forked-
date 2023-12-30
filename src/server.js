// local
const basicPath = `http://localhost/bibar-vue-php/`;

// bibar.site
// const basicPath = `https://bibar.site/`;

const apiUrl = basicPath + `obj_api.php`;

async function sendToServer(data) {
  var form = new FormData();
  form.append("type", data.type);
  form.append("oper", data.oper);
  form.append("id", JSON.stringify(data.id));
  form.append("prop", JSON.stringify(data.prop));
  if (data.reload) {
    form.append("reload", JSON.stringify(data.reload));
  }
  if (data.file) {
    form.append("file", data.file);
  }

  // for (const pair of form.entries()) {
  //   console.log(`${pair[0]}, ${pair[1]}`);
  // }

  //   const response = await fetch(apiUrl, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });
  const response = await fetch(apiUrl, {
    method: "POST",
    body: form,
  });
  const responseData = await response.text();

  var obj;
  try {
    obj = JSON.parse(responseData);
    if (typeof obj["error"] != "undefined") {
      console.log("Error from " + service + ".php - " + obj["error"]);
      return null;
    }
    return obj;
  } catch (err) {
    console.log("Error from obj_api.php - " + responseData);
    return null;
  }

  // if (!response.ok) {
  //   const error = new Error(responseData.message || 'Failed to fetch!');
  //   throw error;
  // }
}

export { sendToServer };

import { biProject } from "./components/project/biProject";

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

  if (data.file) {
    form.append("file", data.file);
  }

  data.reload = biProject.main.dbId;
  if (data.reload) {
    form.append("reload", JSON.stringify(data.reload));
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

  var obj = null;
  try {
    obj = JSON.parse(responseData);
  } catch (err) {
    console.log("Error from obj_api.php - " + responseData);
    return null;
  }

  if (obj) {
    if (typeof obj["error"] != "undefined") {
      console.log("Error from " + service + ".php - " + obj["error"]);
      return null;
    }
    if (obj.objects_to_reload) {
      obj.objects_to_reload.elements.forEach(function (id) {
        const elm = biProject.main.getElement(id);
        elm.reload();
      });
    }
    return obj;
  }

  // if (!response.ok) {
  //   const error = new Error(responseData.message || 'Failed to fetch!');
  //   throw error;
  // }
}

export { sendToServer };

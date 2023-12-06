import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useLinks({ storeMethods, projId }) {
  const links = ref([]);
  provide("links", links);

  // access objects
  function getLink(prop) {
    if (prop.id) {
      return links.value.find(function (pLink) {
        return pLink.id == prop.id;
      });
    }
    if (prop.res) {
      return links.value.find(function (pLink) {
        return pLink.research_id == prop.res;
      });
    }
    return null;
  }

  function getCategory(linkId, col) {
    const link = getLink({ id: linkId });
    if (link == null) {
      return null;
    }
    const cat = link.categories.find((pCat) => {
      return pCat.col == col;
    });
    return cat;
  }

  function linkObjId(link) {
    return {
      proj: link.proj,
      link: link.id,
    };
  }

  function getName(prop) {
    let link = null;
    if (prop.id) {
      link = getLink({ id: prop.id });
    }
    if (prop.obj) {
      link = prop.obj;
    }
    if (!link) {
      return "link";
    }

    if (link.research_id != 0) {
      return storeMethods.res.getName({ id: link.research_id });
    }
    if (link.name != "") {
      return link.name;
    }
    return "link" + link.id;
  }

  // access database
  async function updateCategory(link, cat, attr) {
    // update browser
    Object.assign(cat, attr);

    // update server
    const data = {
      type: "link",
      oper: "upd_cat",
      id: linkObjId(link),
      prop: {
        cat_id: cat,
        cat_attr: attr,
      },
    };
    const obj = await sendToServer(data);
  }

  async function addElementToLink(link, elmId) {
    if (!link.elements.includes(elmId)) {
      link.elements.push(elmId);
    }

    const data = {
      type: "link",
      oper: "add_elm",
      id: linkObjId(link),
      prop: { elm: elmId },
    };
    const obj = await sendToServer(data);
  }

  async function removeElementFromLink(link, elmId) {
    link.elements = link.elements.filter(function (arrElmId) {
      return arrElmId != elmId;
    });

    const data = {
      type: "link",
      oper: "remove_elm",
      id: linkObjId(link),
      prop: { elm: elmId },
    };
    const obj = await sendToServer(data);
  }

  async function createLink(options) {
    const prop = {
      proj: projId,
      research_id: options.researchId,
      main_element: options.element.id,
    };

    const data = {
      type: "link",
      oper: "new",
      id: { dummy: "" },
      prop,
    };
    const obj = await sendToServer(data);

    links.value.push(obj.data);
    // options.element.verses = [];
    storeMethods.elm.reload(options.element);
  }

  function reloadObj(obj) {
    const link = getLink({ id: obj.id });
    for (let act in obj.actions) {
      switch (act) {
        case "name":
          link.name = obj.actions[act];
          break;
      }
    }
  }

  // return
  const lnkMethods = {
    updateCategory,
    getLink,
    addElementToLink,
    removeElementFromLink,
    getCategory,
    createLink,
    reloadObj,
    getName,
  };
  provide("lnkMethods", lnkMethods);

  return [links, lnkMethods];
}

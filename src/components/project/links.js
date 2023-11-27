import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useLinks({ projId }) {
  const links = ref([]);
  provide("links", links);

  // access objects
  function getLink(linkId) {
    const link = links.value.find((pLink) => {
      return pLink.id == linkId;
    });
    return link;
  }

  function getCategory(linkId, col) {
    const link = getLink(linkId);
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

  async function createLink(prop) {
    prop.proj = projId;
    const data = {
      type: "link",
      oper: "new",
      id: { dummy: "" },
      prop,
    };
    const obj = await sendToServer(data);
    links.value.push(obj.data);
  }

  // return
  const lnkMethods = {
    updateCategory,
    getLink,
    addElementToLink,
    removeElementFromLink,
    getCategory,
    createLink,
  };
  provide("lnkMethods", lnkMethods);

  return [links, lnkMethods];
}

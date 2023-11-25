import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useLinks() {
  const links = ref([]);
  provide("links", links);

  // access objects
  function getLink(linkId) {
    const link = links.value.find((pLink) => {
      return pLink.id == linkId;
    });
    return link;
  }
  provide("getLink", getLink);

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
  provide("getCategory", getCategory);

  function linkObjId(link) {
    return {
      proj: link.proj,
      link: link.id,
    };
  }

  // access database
  async function lnkUpdateCategory(linkObjId, cat, attr) {
    // update browser
    Object.assign(cat, attr);

    // update server
    const data = {
      type: "link",
      oper: "upd_cat",
      id: linkObjId,
      prop: {
        cat_id: cat,
        cat_attr: attr,
      },
    };
    const obj = await sendToServer(data);
  }
  provide("lnkUpdateCategory", lnkUpdateCategory);

  async function lnkAddElementToLink(link, elementId) {
    if (!link.elements.includes(elementId.value.elm)) {
      link.elements.push(elementId.value.elm);
    }

    const data = {
      type: "link",
      oper: "add_elm",
      id: linkObjId(link),
      prop: { elm: elementId.value.elm },
    };
    const obj = await sendToServer(data);
  }
  provide("lnkAddElementToLink", lnkAddElementToLink);

  async function lnkRemoveElementFromLink(link, elementId) {
    link.elements = link.elements.filter(function (arrElmId) {
      return arrElmId != elementId.value.elm;
    });

    const data = {
      type: "link",
      oper: "remove_elm",
      id: linkObjId(link),
      prop: { elm: elementId.value.elm },
    };
    const obj = await sendToServer(data);
  }
  provide("lnkRemoveElementFromLink", lnkRemoveElementFromLink);

  return links;
}

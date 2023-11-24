import { provide, ref } from "vue";
import { sendToServer } from "../../server.js";

export function useLinks() {
  const links = ref([]);
  provide("links", links);

  function getLink(linkId) {
    const link = links.value.find((pLink) => {
      return pLink.id.link == linkId;
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


  async function lnkUpdateCategory(linkId, cat, attr) {
    // update browser
    Object.assign(cat, attr);
  
    // update server
    const data = {
      type: 'link',
      oper: 'upd_cat',
      id: linkId,
      prop: {
        cat_id: cat,
        cat_attr: attr,
      },
    };
    const obj = await sendToServer(data);
  }
  provide("lnkUpdateCategory", lnkUpdateCategory);
  

  return links;
}

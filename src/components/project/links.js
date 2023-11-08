import { provide, ref } from "vue";

export function useLinks() {
  const links = ref([]);
  provide("links", links);

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

  return links;
}

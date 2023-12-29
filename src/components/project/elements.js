import { provide } from "vue";

export function useElements() {
  function changeName(elm, newName) {
    elm.name = newName;
  }
  // return
  const elmMethods = {
    changeName,
  };
  provide("elmMethods", elmMethods);

  return [ elmMethods];
}

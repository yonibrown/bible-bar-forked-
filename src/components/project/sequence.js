export function seqTitle(key) {
  let nameKey = key.map(function (lvl) {
    return lvl.name;
  });
  return nameKey.join(" ");
}

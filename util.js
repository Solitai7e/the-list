export function sortBy(array, key) {
  return array.toSorted((x, y) => {
    const keyX = key(x), keyY = key(y);
    return keyX > keyY ? 1 : keyX < keyY ? -1 : 0;
  });
}
export function randomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}
export function randomItem(arrayLike) {
  return arrayLike[randomInt(arrayLike.length)];
}
export function attributeValueToInt($checkbox) {
  return $checkbox.indeterminate ? 1 : $checkbox.checked ? 0 : 2;
}
export function genMediaId(media) {
  return encodeURIComponent(media);
}
export function parseList(text) {
  return [...text.matchAll(/(?:^|\n)\*\s+([^\t]+)\s+(.+?)(?=\n\*|$)/gs)].map(match => {
    const media = match[1].trim();
    const chars = match[2].trim().split(/\s*\/\s*/).map(segment => {
      const [, char, meta] = segment.match(/([^~△☾☼☣⊗]+)\s+(.+)/);
      const attributeSets = meta.trim().split(/\s*,\s*/).map(symbols => {
        const attributes = {};
        for (const symbol of symbols.match(/(?:~?[△☾☼☣⊗])+?/g)) {
          const value = symbol.startsWith("~") ? 1 : 0;
          switch (symbol.slice(-1)) {
            case "△": attributes.cloaked          = value; break;
            case "☾": attributes.lightSilhouetted = value; break;
            case "☼": attributes.darkSilhouetted  = value; break;
            case "☣": attributes.hazmat           = value; break;
            case "⊗": attributes.divingSuit       = value; break;
          }
        }
        return attributes;
      });
      return [char, attributeSets];
    });
    return [media, chars];
  });
}
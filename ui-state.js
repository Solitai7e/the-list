import * as UIDom from "./ui-dom.js";
import {sortBy, attributeValueToInt, randomItem} from "./util.js";

class UiState {
  load(list) {
    let charCount = 0;
    const $rows = list.flatMap(([media, chars]) => {
      return chars.flatMap(([char, attributeSets]) => {
        charCount++;
        return attributeSets.map(attributes => {
          return UIDom.makeRow(media, char, attributes);
        });
      });
    });
    const media = list.map(([media]) => media);
    UIDom.updateTable(() => $rows);
    UIDom.setMediaCount(media.length);
    UIDom.setCharCount(charCount);
    UIDom.showOutput();

    return new Loaded(media);
  }
}
export class Initial extends UiState {
  reset() {
    return this;
  }
}
export class Loaded extends UiState {
  constructor(...args) {
    super();
    [this.media, this.sortingColumn] = args;
  }
  sort(column) {
    const key = sortingFuncFor(column);
    const reverse = column === this.sortingColumn;
    UIDom.updateTable($rows => {
      if (reverse)
        return $rows.toReversed();
      else
        return sortBy($rows, $row => key($row.cells[column], $row));
    });
    UIDom.setSortingColumn(column, reverse);

    return new Loaded(this.media, column);
  }
  roll() {
    const media = randomItem(this.media);
    const $row = randomItem(UIDom.getRowsByMedia(media));
    UIDom.selectRow($row);
    UIDom.scrollToRow($row);

    return this;
  }
  reset() {
    UIDom.hideOutput();
    UIDom.clearTable();
    return new Initial;
  }
}

function sortingFuncFor(column) {
  switch (column) {
    case 0: case 1:
      return $cell => $cell.textContent;
    case 2: case 3: case 4: case 5: case 6:
      return $cell => attributeValueToInt($cell.children[0]);
  }
}
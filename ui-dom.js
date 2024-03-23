import {genMediaId} from "./util.js";

const $output = document.getElementById("output");
const $mediaCount = document.getElementById("media-count");
const $charCount = document.getElementById("char-count");
const $table = $output.querySelector("table");
const $tbody = $table.createTBody();

export function unlock() {
  document.body.style.pointerEvents = "";
}
export function showOutput() {
  $output.style.display = "";
}
export function hideOutput() {
  $output.style.display = "none";
}
export function makeRow(media, char, attributes) {
  const $media = document.createElement("td");
  $media.textContent = media;
  const $char = document.createElement("td");
  $char.textContent = char;
  const $row = document.createElement("tr");
  $row.classList.add(`media-${genMediaId(media)}`);
  $row.append(
    $media,
    $char,
    makeAttributeCell(attributes.cloaked),
    makeAttributeCell(attributes.darkSilhouetted),
    makeAttributeCell(attributes.lightSilhouetted),
    makeAttributeCell(attributes.hazmat),
    makeAttributeCell(attributes.divingSuit),
  );
  if (attributes.cloaked)          $row.classList.add("cloaked");
  if (attributes.darkSilhouetted)  $row.classList.add("dark-silhouetted");
  if (attributes.lightSilhouetted) $row.classList.add("light-silhouetted");
  if (attributes.hazmat)           $row.classList.add("hazmat");
  if (attributes.divingSuit)       $row.classList.add("diving-suit");
  return $row;
}
export function selectRow($row) {
  if (!$row.classList.contains("selected")) {
    document.querySelector(".selected")?.classList.remove("selected");
    $row.classList.add("selected");
  } else {
    $row.classList.remove("selected");
  }
}
export function scrollToRow($row) {
  $row.scrollIntoView({block: "center", behavior: "smooth"});
}
export function updateTable(func) {
  const $rows = func([...$tbody.rows]);
  clearTable();
  $tbody.append(...$rows);
  mergeCells();
}
export function clearTable() {
  $tbody.innerHTML = "";
}
export function getRowsByMedia(media) {
  const mediaId = genMediaId(media);
  return document.getElementsByClassName(`media-${mediaId}`);
}
export function mergeCells() {
  mergeColumnCells($tbody, 0);
  mergeColumnCells($tbody, 1, $cell => {
    const media = $cell.parentElement.cells[0].textContent;
    const char = $cell.textContent;
    return `${media}|${char}`;
  });
}
export function setMediaCount(count) {
  $mediaCount.textContent = count;
}
export function setCharCount(count) {
  $charCount.textContent = count;
}
export function setSortingColumn(column, reversed) {
  document.querySelector(".sorting")?.classList.remove("sorting", "reversed");

  const $th = $table.tHead.rows[0].cells[column];
  $th.classList.add("sorting");
  $th.classList.toggle("reversed", reversed);
}

function makeAttributeCell(state) {
  const $checkbox = document.createElement("input");
  $checkbox.type = "checkbox";
  $checkbox.disabled = true;
  switch (state) {
    case 0:  $checkbox.checked       = true;  break;
    case 1:  $checkbox.indeterminate = true;  break;
    default: $checkbox.checked       = false; break;
  }
  const $cell = document.createElement("td");
  $cell.classList.add("attribute");
  $cell.append($checkbox);
  return $cell;
}
function mergeColumnCells({rows}, column, key = $td => $td.textContent) {
  let $preceding;
  for (let i = 0, count = rows.length; i < count; i++) {
    const $cell = rows[i].cells[column];
    if ($preceding && key($cell) === key($preceding)) {
      $cell.style.display = "none";
      $preceding.rowSpan++;
    } else {
      $preceding = $cell;
      $preceding.style.display = "";
      $preceding.rowSpan = 1;
    }
  }
}

$tbody.addEventListener("click", event => {
  const $row = event.target.closest("tr");
  if ($row)
    selectRow($row);
});
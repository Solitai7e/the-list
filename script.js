import * as UIState from "./ui-state.js";
import * as UIDom from "./ui-dom.js";
import {parseList} from "./util.js";

window.addEventListener("error", e => {
  new Notification("Unhandled Error", {body: e.message});
});
window.addEventListener("unhandledrejection", e => {
  new Notification("Unhandled Rejection", {body: e.reason?.message});
});

let uiState = new UIState.Initial;

window.load = input => {
  if (!input) {
    input = prompt("Paste the list here and click OK:");
    if (!input) return;
    try { localStorage.setItem("imported", input); } catch {}
  }
  uiState = uiState.load(parseList(input));
};
window.reset = () => {
  localStorage.removeItem("imported");
  uiState = uiState.reset();
};
window.roll = () => uiState = uiState.roll?.() ?? uiState;
window.sort = c => uiState = uiState.sort?.(c) ?? uiState;

try { 
  let input = localStorage.getItem("imported"); 
  if (!input) {
    const response = await fetch("The_List_TM.txt");
    if (response.ok)
      input = await response.text();
  }
  uiState = uiState.load(parseList(input));
} catch {}

UIDom.unlock();
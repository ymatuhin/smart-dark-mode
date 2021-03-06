const invertCheck: HTMLInputElement = document.querySelector(".js-invert")!;
const customScrollCheck: HTMLInputElement =
  document.querySelector(".js-custom-scroll")!;
const defaultCustomScrollCheck: HTMLInputElement = document.querySelector(
  ".js-default-custom-scroll",
)!;

chrome.storage.sync.get(
  ["invertedIcon", "customScroll", "defaultCustomScroll"],
  ({ invertedIcon, customScroll, defaultCustomScroll }) => {
    invertCheck.checked = Boolean(invertedIcon);
    customScrollCheck.checked = customScroll ?? true;
    defaultCustomScrollCheck.disabled = !customScrollCheck.checked;
    defaultCustomScrollCheck.checked = defaultCustomScroll ?? true;
  },
);

invertCheck.addEventListener("input", handleInvert, { passive: true });
customScrollCheck.addEventListener("click", handleCustomScroll, {
  passive: true,
});
defaultCustomScrollCheck.addEventListener("click", handleDefaultCustomScroll, {
  passive: true,
});

function handleInvert() {
  chrome.storage.sync.set({ invertedIcon: invertCheck.checked });
  chrome.runtime.sendMessage({ type: "icon", value: invertCheck.checked });
}

function handleCustomScroll() {
  defaultCustomScrollCheck.disabled = !customScrollCheck.checked;

  chrome.storage.sync.set({ customScroll: customScrollCheck.checked });
  chrome.runtime.sendMessage({
    type: "custom-scroll",
    value: customScrollCheck.checked,
  });
}

function handleDefaultCustomScroll() {
  chrome.storage.sync.set({
    defaultCustomScroll: defaultCustomScrollCheck.checked,
  });
  chrome.runtime.sendMessage({
    type: "default-custom-scroll",
    value: defaultCustomScrollCheck.checked,
  });
}

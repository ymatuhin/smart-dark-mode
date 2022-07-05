import type { HTMLElementExtended, MiddlewareParams } from ".";
import { checkBackImagePresence } from "../color/check-back-image-presence";
import { logger } from "../config";
import { checkInsideInverted } from "../dom/check-inside-inverted";
import { getSelector } from "../dom/get-selector";
import { addRule, makeRule, mediaFilter } from "../styles";
import { createBitmap, createWorker } from "../worker";

const log = logger("ext:image");

export default async function (params: MiddlewareParams) {
  const { element, isDocument, inverted } = params;

  if (inverted) return params;
  if (!element || isDocument) return params;
  if (element instanceof HTMLVideoElement) return params;
  if (element instanceof HTMLEmbedElement) return params;
  if (element instanceof HTMLObjectElement) return params;
  if (!element.isConnected) return params;
  if (checkInsideInverted(element)) return params;

  const styles = getComputedStyle(element);
  const hasImage = checkBackImagePresence(styles);
  const isImg = element instanceof HTMLImageElement;
  if (!hasImage && !isImg) return params;

  const newInverted = await handleElement(element, styles);

  return { ...params, inverted: newInverted };
}

async function handleElement(
  element: HTMLElementExtended,
  styles: CSSStyleDeclaration,
) {
  const src =
    element instanceof HTMLImageElement
      ? element.getAttribute("src")
      : styles.backgroundImage.slice(5, -2);

  // return false;

  // const isColorful = (await checkIsColorful(src!)) ?? true;
  const isColorful = true;
  if (isColorful) {
    const selector = getSelector(element);
    const rule = makeRule(`${selector} { ${mediaFilter} }`);
    log("addRule", { isColorful, src, element, rule });
    addRule(rule);
    element.__sdm_inverted = true;
    element.__sdm_rule = rule;
  }

  return isColorful;
}

// simple cache
const map = new Map();
function checkIsColorful(src: string) {
  if (map.has(src)) return Promise.resolve(map.get(src));

  return new Promise(async (res) => {
    try {
      const bitmap = await createBitmap(src);
      const worker = createWorker();
      worker.postMessage(bitmap);
      worker.onmessage = ({ data: colorful }) => {
        map.set(src, colorful);
        res(colorful);
      };
    } catch (error) {
      log("error", { src, error });
      map.set(src, undefined);
      return res(undefined);
    }
  });
}
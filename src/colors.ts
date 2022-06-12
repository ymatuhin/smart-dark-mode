export function rgbaAsArray(rgbString: string) {
  const [r, g, b, a = 1] = rgbString
    .replace(/ /g, "")
    .replace(/rgba?/g, "")
    .replace(/[()]/g, "")
    .split(",")
    .map((i) => +i);
  return { r, g, b, a };
}

export function rgbToHsl(r: number, g: number, b: number) {
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    // @ts-ignore
    h /= 6;
  }
  l = Math.round(l * 100);
  return { h, s, l };
}

export function getBgLightnessStatus(styles: CSSStyleDeclaration) {
  const { r, g, b, a } = rgbaAsArray(styles.backgroundColor);
  if (a < 0.8) return null;
  const { l } = rgbToHsl(r, g, b);
  return l > 55 ? "light" : l < 35 ? "dark" : "medium";
}

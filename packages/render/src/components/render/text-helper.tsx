export function getTextWidthWithFontSize(text: string, fontSize: number) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = `${ fontSize }px Arial`;
  return context.measureText(text).width;
}

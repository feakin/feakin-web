import { Converter } from "@feakin/exporter";

const DOT_LANG = "dot";

export function fileExport(text: string, outputType: string) {
  let output = Converter.fromContent(text, DOT_LANG).target(outputType);

  const element = document.createElement("a");
  const file = new Blob([output], {
    type: "text/plain"
  });
  element.href = URL.createObjectURL(file);
  element.download = "feakin-export." + outputType;
  document.body.appendChild(element);
  element.click();
}

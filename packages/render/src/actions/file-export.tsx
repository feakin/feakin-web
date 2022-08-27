export function fileExport(text: string, outputType: string) {
  const element = document.createElement("a");
  const file = new Blob([text], {
    type: "text/plain"
  });
  element.href = URL.createObjectURL(file);
  element.download = "feakin-export." + outputType;
  document.body.appendChild(element);
  element.click();
}

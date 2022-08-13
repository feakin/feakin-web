interface FileData {
  data: Uint8Array;
  contentType: string;
}

export function dataURLtoFileData(dataURL: string): FileData {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const data = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    data[i] = byteString.charCodeAt(i);
  }

  return {
    data: data,
    contentType: mimeString
  };
}

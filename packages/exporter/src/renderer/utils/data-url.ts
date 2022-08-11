interface FileData {
  data: Uint8Array;
  contentType: string;
}

export function dataURLtoFileData(dataURL: string): FileData {
  let byteString = atob(dataURL.split(',')[1]);
  let mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  let ab = new ArrayBuffer(byteString.length);
  let data = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    data[i] = byteString.charCodeAt(i);
  }

  return {
    data: data,
    contentType: mimeString
  };
}

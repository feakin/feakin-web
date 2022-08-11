export function dataURLtoFileData(dataurl: string) {
  const arr = dataurl.split(',');
  if (arr == null || arr.length === 1) {
    throw new Error('Invalid data URL');
  }

  const bstr = atob(arr[1]);
  let length = bstr.length;
  const u8arr = new Uint8Array(length);

  while (length--) {
    u8arr[length] = bstr.charCodeAt(length);
  }

  return {
    data: u8arr
  }
}

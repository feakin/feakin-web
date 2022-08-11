import { dataURLtoFileData } from "./data-url";

describe('dataURLtoFileData', () => {
  it('convert', () => {
    const image = `data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`;
    let data = dataURLtoFileData(image);

    expect(data.contentType).toBe('image/gif');
    expect(data.data.length).toBe(37);
    expect(data.data.toString()).toBe("71,73,70,56,57,97,1,0,1,0,0,0,0,33,249,4,1,10,0,1,0,44,0,0,0,0,1,0,1,0,0,2,2,76,1,0,59");
  });
});

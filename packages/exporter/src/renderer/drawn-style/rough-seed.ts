export const randomInteger = () => {
  const seed = Date.now();
  const random = ((2 ** 31 - 1) & (Math.imul(48271, seed))) / 2 ** 31
  return Math.floor(random * 2 ** 31);
};

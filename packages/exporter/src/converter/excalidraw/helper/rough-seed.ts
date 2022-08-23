export const randomInteger = () => {
  const seed = Math.imul(48271, Date.now());
  const random = ((2 ** 31 - 1) & seed) / 2 ** 31
  return Math.floor(random * 2 ** 31);
};

import { Random } from "roughjs/bin/math";

const random = new Random(Date.now());
export const randomInteger = () => Math.floor(random.next() * 2 ** 31);


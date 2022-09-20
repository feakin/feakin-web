import init from "fkl-wasm";
import { parse } from "fkl-wasm";

init().then(() => {
  let result = parse(`ContextMap {
  SalesContext <-> SalesContext;
}`);
  console.log(JSON.stringify(result, null, 2));
}).catch(console.error);

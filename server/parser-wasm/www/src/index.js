import init, {FklParser} from "fkl-wasm";
import { parse } from "fkl-wasm";

init().then(() => {
  let result = new FklParser(`ContextMap {
  SalesContext <-> SalesContext;
}`).parse();
  console.log(result);
  console.log(JSON.stringify(result, null, 2));
}).catch(console.error);

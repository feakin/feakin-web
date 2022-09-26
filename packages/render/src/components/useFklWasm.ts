import { useEffect, useState } from "react";
import init, { FklParser } from "@feakin/fkl-wasm-web";

export const useFklWasm = () => {
  const [state, setState] = useState(null as any);
  useEffect(() => {
    const fetchWasm = async () => {
       await init();
    };

    fetchWasm().then(() => {
      setState(FklParser);
    });
  }, []);
  return state;
}

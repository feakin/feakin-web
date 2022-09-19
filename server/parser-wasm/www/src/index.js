import init from "parser-rust";

init().then((wasm) => {
  let result = wasm.parse("hello world");
  console.log(result);
});

console.log("..");

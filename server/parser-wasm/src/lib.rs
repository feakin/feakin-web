mod utils;
mod dot_gen;

use wasm_bindgen::prelude::*;
use fkl_parser::parse as fkl_parse;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
  fn alert(s: &str);
}

#[wasm_bindgen]
pub fn parse(input: String) -> Result<JsValue, JsValue>  {
  let values = fkl_parse(input.as_str()).unwrap();
  let js_value = serde_wasm_bindgen::to_value(&values)?;

  Ok(js_value)
}

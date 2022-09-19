mod utils;
mod dot_gen;

use wasm_bindgen::prelude::*;
use fkl_parser::parse as fkl_parse;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
//
// #[wasm_bindgen]
// extern {
//     fn parse(s: &str);
// }

#[wasm_bindgen]
pub fn parse(s: &str) -> JsValue {
  let values = fkl_parse(s)
    .expect("TODO: panic message");

  serde_wasm_bindgen::to_value(&values).unwrap()
}

mod utils;
mod dot_gen;

use wasm_bindgen::prelude::*;
use fkl_parser::parse;

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
pub fn greet(s: &str) {
    parse(s)
      .expect("TODO: panic message");
}

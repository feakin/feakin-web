pub static INDENT_SIZE: usize = 2;

pub fn ident(depth: usize) -> String {
    return " ".repeat(INDENT_SIZE * depth)
}

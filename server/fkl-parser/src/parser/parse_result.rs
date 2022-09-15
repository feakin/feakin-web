use std::error::Error as StdError;
use std::fmt;

#[derive(Debug)]
pub enum ErrorKind {
  Msg(String),
  // Json(serde_json::Error),
  Io(std::io::ErrorKind),
}

#[derive(Debug)]
pub struct ParseError {
  /// Kind of error
  pub kind: ErrorKind,
  source: Option<Box<dyn StdError + Sync + Send>>,
}


impl fmt::Display for ParseError {
  fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
    match self.kind {
      ErrorKind::Msg(ref message) => write!(f, "{}", message),
      // ErrorKind::Json(ref e) => write!(f, "{}", e),
      ErrorKind::Io(ref io_error) => {
        write!(f, "Io error while writing rendered value to output: {:?}", io_error)
      }
    }
  }
}

impl StdError for ParseError {
  fn source(&self) -> Option<&(dyn StdError + 'static)> {
    self.source.as_ref().map(|c| &**c as &(dyn StdError + 'static))
  }
}

impl ParseError {
  /// Creates generic error
  pub fn msg(value: impl ToString) -> Self {
    Self { kind: ErrorKind::Msg(value.to_string()), source: None }
  }

  pub fn io_error(error: std::io::Error) -> Self {
    Self { kind: ErrorKind::Io(error.kind()), source: Some(Box::new(error)) }
  }

  // pub fn json(value: serde_json::Error) -> Self {
  //   Self { kind: ErrorKind::Json(value), source: None }
  // }
}

impl From<std::io::Error> for ParseError {
  fn from(error: std::io::Error) -> Self {
    Self::io_error(error)
  }
}

impl From<&str> for ParseError {
  fn from(e: &str) -> Self {
    Self::msg(e)
  }
}

impl From<String> for ParseError {
  fn from(e: String) -> Self {
    Self::msg(e)
  }
}

// impl From<serde_json::Error> for ParseError {
//   fn from(e: serde_json::Error) -> Self {
//     Self::json(e)
//   }
// }
/// Convenient wrapper around std::Result.
pub type ParseResult<T> = std::prelude::v1::Result<T, ParseError>;

#[cfg(test)]
mod tests {
  #[test]
  fn test_error_is_send_and_sync() {
    fn test_send_sync<T: Send + Sync>() {}

    test_send_sync::<super::ParseError>();
  }
}
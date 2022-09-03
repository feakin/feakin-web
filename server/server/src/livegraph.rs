#[cfg(test)]
mod tests {
  use diamond_types::list::OpLog;

  #[test]
  fn it_works() {
    let mut oplog = OpLog::new();
    let fred = oplog.get_or_create_agent_id("fred");
    oplog.add_insert(fred, 0, "abc");
    oplog.add_delete_without_content(fred, 1..2); // Delete the 'b'

    let car = oplog.get_or_create_agent_id("car");
    oplog.add_insert(car, 2, "def");

    let string = format!("{:?}", oplog.checkout_tip().content());
    assert_eq!("acdef".to_string(), string);
  }
}

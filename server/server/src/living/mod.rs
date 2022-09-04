use rand::distributions::Alphanumeric;
use rand::Rng;

pub mod live_coding;
pub mod live_graph;
pub mod pairing;


pub fn random_agent_name() -> String {
  rand::thread_rng()
    .sample_iter(&Alphanumeric)
    .take(12)
    .map(char::from)
    .collect()
}

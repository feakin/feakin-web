use rand::{Rng, thread_rng};
use diamond_types::AgentId;

pub type RoomId = String;

pub type ConnId = AgentId;

pub fn id_generator() -> u32 {
  thread_rng().gen::<u32>()
}

// pub type Msg = String;

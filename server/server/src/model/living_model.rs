use rand::{Rng, thread_rng};
use diamond_types::AgentId;
use diamond_types::list::remote_ids::RemoteId;
use smallvec::SmallVec;

pub type RoomId = String;

pub type ConnId = AgentId;

pub type RemoteVersion = SmallVec<[RemoteId; 4]>;

pub fn id_generator() -> u32 {
  thread_rng().gen::<u32>()
}

// pub type Msg = String;

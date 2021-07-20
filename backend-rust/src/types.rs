use rocket::serde::{Deserialize, Serialize};

type Id = usize;

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Message {
    pub id: Option<Id>,
}

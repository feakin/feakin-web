#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Default)]
pub struct Field {
    pub name: String,
    pub value: String,
    pub type_type: String,
}

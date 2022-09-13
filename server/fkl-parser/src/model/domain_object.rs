pub trait DomainObject {
    fn name(&self) -> &str;
    fn description(&self) -> &str;
    fn context(&self) -> &str;
    fn is_root(&self) -> bool;
}

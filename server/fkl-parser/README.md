# Feakin Knowledge Languag

DDD Building Blocks

- ContextMap
- Bounded Context
  - Shared Kernel
  - Anti-corruption Layer
- Domain
  - Sub-domain
  - Core-domain
  - Generic Domain
- Layered Architecture

```groovy
ContextMap {
  context1 {
    // AI Generator ?
    boundedContext1 {
      sharedKernel
      antiCorruptionLayer
      domain {
        subDomain
        coreDomain
        genericDomain
      }
      infrastructure
      application
      presentation
    }
  }
}
```

Context Binding

binding source code to Context Map

```
ContextBinding {

}
```

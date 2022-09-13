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

```kotlin
ContextMap {
  Context ShoppingCarContext(display = "Shopping") with ACL
  
}

Context ShoppingCarContext  {
  
}

// render wtih UML styled?
SubDomain Cart {
  Aggregate Cart {
    Entity Cart
    ValueObject CartId
    ValueObject CartStatus
    ValueObject CartItem
    ValueObject CartItemQuantity
    ValueObject CartItemPrice
    ValueObject CartItemTotal
    ValueObject CartTotal
  }
}

DomainLanguage Shopping {

}

```

```kotlin

}
```

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

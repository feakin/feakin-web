# Feakin Knowledge Languag

## DDD Building Blocks

- ContextMap
- Bounded Context
  - Shared Kernel
  - Anti-corruption Layer
- Subdomin
  - Core-domain
  - Supporting-domain
  - Generic-domain
- Layered Architecture

## Syntax and Semantics

```kotlin
ContextMap {
  with? type("Landscape")
  ShoppingCarContext <-> MallContext;
}

Context ShoppingCarContext  {
  with? acl {
    with type("Anti-corruption Layer")
    with name("ShoppingCarACL")
    with description("Anti-corruption Layer for ShoppingCar")
  }
  with display("Shopping Car")
}

// render wtih UML styled?
SubDomain Cart {
  Aggregate Cart {
    // Concept or UML like ?
    // can be inside or outside of the Aggregate
    Entity Cart {
      
    }
    
    // it's to many, can change in different way.
    ValueObject CartId
    ValueObject CartStatus
    ValueObject CartItem
    ValueObject CartItemQuantity
    ValueObject CartItemPrice
    ValueObject CartItemTotal
    ValueObject CartTotal
  }
}

// global detail for Cart.
Entity Cart {

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

## Context Binding

binding source code to Context Map

```
ContextBinding {
  basePackage = se.citerus.dddsample.domain.model
}
```

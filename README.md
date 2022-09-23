# Feakin

> Modernize architecture visualization assets management, based on Diagram-as-code, so you can create, share and edit diagram. Support for import Mermaid, PlantUML, Excalidraw, Dot and more.

[![CI](https://github.com/feakin/feakin/actions/workflows/ci.yml/badge.svg)](https://github.com/feakin/feakin/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/feakin/feakin/branch/master/graph/badge.svg?token=XO0930Z3TE)](https://codecov.io/gh/feakin/feakin) ![npm](https://img.shields.io/npm/v/@feakin/parser)

[![Code Coverage](https://codecov.io/gh/feakin/feakin/branch/master/graphs/tree.svg?token=XO0930Z3TE)](https://app.codecov.io/gh/feakin/feakin)

Chinese introduction: Feakin 是一个架构资产可视化管理工具。基于[图表即代码](https://www.phodal.com/blog/diagram-as-code/) 的思想体系，支持导入 Mermaid, PlantUML, Excalidraw, Dot 等图形资产格式。

Core Technical: 

- concepts: Collaboration (CRDT) + DSL (pest.rs) + Graph Engine + Editor Language (Monaco)
- stacks: Rust( + WASM) + React + TypeScript

特性：

- Graph
  - [x] 跨图工具转换。支持导入 Mermaid, PlantUML, Excalidraw, Dot 等图形资产格式，并基于 Graph MIR 进行转换。
  - [x] 广泛的图表格式导出。
    - [x] Drawio
    - [x] Excalidraw
  - [x] 模板创建。支持创建模板，并基于 Graph MIR 进行转换，转换成其它图表格式。
  - [ ] 多样化图形布局。支持 Dagre、ELK、Cola 等布局。
  - [x] Dagre
  - [ ] 手绘风格。
    - [x] Rough.js sample
- [x] Collaboration
  - [x] Server
  - [x] Protocol
    - [x] CRDT
  - [x] Editor
- [ ] DSL
  - [ ] FKL Syntax
  - [x] FKL Parser
  - [ ] FKL LSP
- [ ] Editor
  - [x] Dot Language
  - [ ] Fkl Language 

  
## Demos

Try Online demo: [https://online.feakin.com/](https://online.feakin.com/) Or install `@feakin/cli` for diagrams converter: 

```shell
npm install -g @feakin/cli

feakin --input software-development.md.drawio --output sd.excalidraw
```

## Todos

- [ ] Render
  - [x] Layout Engine (TODO: split to standalone module)
    - [x] [dagre](https://github.com/dagrejs/dagre)
    - [ ] [ELK](https://github.com/kieler/elkjs)
    - [ ] [cola.js](https://ialab.it.monash.edu/webcola/)
  - [x] Canvas
    - [x] [Konva.js](https://github.com/konvajs/konva), react: [react-konva](https://github.com/konvajs/react-konva)
  - [x] Style
    - [x] [roughjs](https://github.com/rough-stuff/rough): sketchy, hand-drawn-like, style
- [ ] Editor
  - [x] text Editor with Monaco Editor
  - [ ] interactive Editor with Graphical Editor
- [x] Parser
  - [x] [Jison](https://github.com/zaach/jison) with Mermaid
- [ ] collaboration
  - [ ] [Rope Architecture Model](https://blog.jetbrains.com/zh-hans/fleet/2022/02/fleet-below-deck-part-ii-breaking-down-the-editor/)
    - [Rope](https://github.com/component/rope)
  - [ ] [State Management](https://blog.jetbrains.com/zh-hans/fleet/2022/06/fleet-below-deck-part-iii-state-management/)
- [x] CLI
  - [x] upgrade publish script
- [ ] Architecture Features
  - [x] Playground: [https://online.feakin.com/](https://online.feakin.com/)
  - [ ] [ComponentLess](https://componentless.com/) architecture
    - [ ] WebComponent, like `<feakin data="" layout="" import="" import-type=""></feakin>`
  - [ ] Templates
    - [ ] DDD ?
    - [ ] Layered Architecture
    - [ ] Test Pyramid
  - [x] Export and Import
    - [x] MxGraph
    - [x] Excalidraw
    - [ ] PlantUML
- [ ] Libraries
  - [ ] compatible Excalidraw libraries : https://libraries.excalidraw.com/?theme=light&sort=default

## Setup

We use nx.js for mono-repo architecture.

1. install

```shell
npm install --legacy-peer-deps
```

Note: nx.js use Craco, which will need `--legacy-peer-deps`.

2. development exporter, can just run by tests

## License

- Flow parser based on [mermaid.js](https://github.com/mermaid-js/)
- Excalidraw's type based on [excalidraw](https://github.com/excalidraw/excalidraw)

@2022 Thoughtworks This code is distributed under the MPL license. See `LICENSE` in this directory.

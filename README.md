# Feakin

> Modernize graph assets management, based on Diagram-as-code, so you can create, share and edit diagram. Support for import Mermaid, PlantUML, Excalidraw, Dot and more.

[![CI](https://github.com/feakin/feakin/actions/workflows/ci.yml/badge.svg)](https://github.com/feakin/feakin/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/feakin/feakin-poc/branch/master/graph/badge.svg?token=XO0930Z3TE)](https://codecov.io/gh/feakin/feakin-poc) ![npm](https://img.shields.io/npm/v/@feakin/parser)

[![Code Coverage](https://codecov.io/gh/feakin/feakin-poc/branch/master/graphs/tree.svg?token=XO0930Z3TE)](https://app.codecov.io/gh/feakin/feakin-poc)

Chinese introduction: Feakin 是一个图形资产管理工具，基于[图表即代码](https://www.phodal.com/blog/diagram-as-code/) 的思想体系，支持导入 Mermaid, PlantUML, Excalidraw, Dot 等图形资产格式。

特性：

- [ ] 跨图表工具转换。支持导入 Mermaid, PlantUML, Excalidraw, Dot 等图形资产格式，并基于 Graph MIR 进行转换。
- [ ] 模板创建。支持创建模板，并基于 Graph MIR 进行转换，转换成其它图表格式。
- [ ] 在线协作编辑。基于 Rope 架构模型和 Graph MIR 进行在线协作编辑。
- [ ] 广泛的图表格式导出。
- [ ] 手绘风格。
- [ ] 多样化图形布局。支持 Dagre、ELK、Cola 等布局。

todos:

- [x] Layout Model Design
  - [x] Shape
  - [ ] Edge
  - [x] Geometry
- [ ] Render
  - [x] Layout Engine (TODO: split to standalone module)
    - [x] [dagre](https://github.com/dagrejs/dagre)
    - [ ] [ELK](https://github.com/kieler/elkjs)
    - [ ] [cola.js](https://ialab.it.monash.edu/webcola/)
  - [ ] SVG
  - [x] Canvas
    - [ ] [D3.js](https://github.com/d3/d3)
    - [x] [Konva.js](https://github.com/konvajs/konva), react: [react-konva](https://github.com/konvajs/react-konva)
    - [ ] [PixiJS](https://github.com/pixijs/pixijs)
    - [ ] [Fabric.js](https://github.com/fabricjs/fabric.js) SVG-to-Canvas (& canvas-to-SVG) Parser
  - [ ] Style
    - [x] [roughjs](https://github.com/rough-stuff/rough): sketchy, hand-drawn-like, style
    - [ ] [perfect freehand](https://github.com/steveruizok/perfect-freehand)
- [ ] Editor
  - [ ] text Editor with Monaco Editor
  - [ ] interactive Editor with Graphical Editor
- [x] Parser
  - [x] [Jison](https://github.com/zaach/jison) with Mermaid
  - [ ] Antlr ???
- [ ] Collision Detection
  - [ ] [SAT.js](https://github.com/jriecken/sat-js) A simple JavaScript library for performing 2D collision detection
  - [ ] [RBush](https://github.com/mourner/rbush is a high-performance JavaScript library for 2D spatial indexing of points and rectangles.
  - [ ] [JSTS](https://github.com/bjornharrtell/jsts) is an ECMAScript library of spatial predicates and functions for processing geometry conforming to the Simple Features Specification for SQL published by the Open Geospatial Consortium.
- [ ] collaboration
  - [ ] [Rope Architecture Model](https://blog.jetbrains.com/zh-hans/fleet/2022/02/fleet-below-deck-part-ii-breaking-down-the-editor/)
  - [ ] [State Management](https://blog.jetbrains.com/zh-hans/fleet/2022/06/fleet-below-deck-part-iii-state-management/)
- [ ] Publish to CLI
  - [ ] upgrade publish script
- [ ] Architecture Features
  - [ ] [ComponentLess](https://componentless.com/) architecture
    - [ ] WebComponent, like `<feakin data="" layout="" import="" import-type=""></feakin>`
  - [ ] Templates
    - [ ] DDD ?
    - [ ] Layered Architecture
    - [ ] Test Pyramid
  - [ ] Static Pages
    - Feakin Space
  - [x] Export and Import
    - [ ] MxGraph
    - [ ] Excalidraw
    - [ ] PlantUML
  
## Setup

1. install

```
npm install --legacy-peer-deps
```

2. run by tests

## Refs

- [https://bivector.net/lib.html](https://bivector.net/lib.html)
- [https://github.com/enkimute/ganja.js](https://github.com/enkimute/ganja.js)

## License

- Flow parser based on [mermaid.js](https://github.com/mermaid-js/)
- Excalidraw's type based on [excalidraw](https://github.com/excalidraw/excalidraw)

@2022 This code is distributed under the MPL license. See `LICENSE` in this directory.

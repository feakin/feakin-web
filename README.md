# Feakin

[![CI](https://github.com/feakin/feakin/actions/workflows/ci.yml/badge.svg)](https://github.com/feakin/feakin/actions/workflows/ci.yml)

todos:

- [x] Layout Model Design
  - [x] Shape
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
- [ ] Editor
  - [ ] text Editor with Monaco Editor
  - [ ] interactive Editor with Graphical Editor
- [ ] Static Pages
  - Feakin Space
- [x] Parser
  - [x] [Jison](https://github.com/zaach/jison) with Mermaid
- [x] Export
  - [ ] MxGraph
- [ ] Import
  - [ ] MxGraph
  - [ ] Excalidraw
- [ ] collaboration
  - [ ] [Rope Architecture Model](https://blog.jetbrains.com/zh-hans/fleet/2022/02/fleet-below-deck-part-ii-breaking-down-the-editor/)
  - [ ] [State Management](https://blog.jetbrains.com/zh-hans/fleet/2022/06/fleet-below-deck-part-iii-state-management/)
- Diagram analysis
  - [ ] draw.io (level 1)
  - [ ] excalidraw
  - [ ] Mermaid.js
  - [ ] Flowchart.js
- [ ] [ComponentLess](https://componentless.com/) architecture
  - [ ] WebComponent, like `<feakin data="" layout="" import="" import-type=""></feakin>`

## Setup

```
npm install --legacy-peer-deps
```

## License

- Flow parser based on [mermaid.js](https://github.com/mermaid-js/)
- Excalidraw's type based on [excalidraw](https://github.com/excalidraw/excalidraw)

@2022 This code is distributed under the MPL license. See `LICENSE` in this directory.

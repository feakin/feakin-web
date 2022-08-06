# Feakin

[![CI](https://github.com/feakin/feakin/actions/workflows/ci.yml/badge.svg)](https://github.com/feakin/feakin/actions/workflows/ci.yml)

todos:

- [ ] Layout Model Design
  - [] Shape
  - [] Geometry
- [ ] Render
  - [ ] Layout Engine (TODO: split to standalone module)
    - [ ] [dagre](https://github.com/dagrejs/dagre)
    - [ ] [ELK](https://github.com/kieler/elkjs)
    - [ ] [cola.js](https://ialab.it.monash.edu/webcola/)
  - [ ] Canvas
    - [ ] [D3.js](https://github.com/d3/d3)
    - [ ] [Konva.js](https://github.com/konvajs/konva), react: [react-konva](https://github.com/konvajs/react-konva)
    - [ ] [PixiJS](https://github.com/pixijs/pixijs)
    - [ ] [Fabric.js](https://github.com/fabricjs/fabric.js) SVG-to-Canvas (& canvas-to-SVG) Parser
- [ ] Parser
  - [ ] [Jison](https://github.com/zaach/jison) with Mermaid
- [ ] Export
  - [ ] MxGraph
- [ ] Import
  - [ ] MxGraph
  - [ ] Excalidraw
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

@2022 This code is distributed under the MPL license. See `LICENSE` in this directory.

# Feakin Development


## Known Issues

### Triangle

Source:

- Triangle in drawio is not rendered correctly. In Draw.io the triangle will replace to `mxgraph.basic.acute_triangle`;
- Excalidraw don't have triangle. We use line shape to replace triangle.

Render:

In Konva.js, the triangle Polygon, as follows:

```jsx
<Line
  points={ points }
  closed
/>
```

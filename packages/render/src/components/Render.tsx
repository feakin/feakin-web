import React, { useEffect } from 'react';
import {
  Arrow,
  Group,
  Layer,
  Rect,
  Stage,
  Text,
  Transformer,
} from 'react-konva';
import Konva from 'konva';
import { FK_RECT_NAME } from './shapes/FkRect';
import { Node, Edge, flattenPoints, DotImporter, Graph } from "@feakin/exporter";
import { ChangeHistory } from "../repository/change-history";
import NodeRender from "./NodeRender";
import EdgeShape from "./EdgeShape";

function Render(props: { text: string, history: ChangeHistory }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_selectedId, selectShape] = React.useState<number | null>(null);
  const stageRef = React.useRef<Konva.Stage | null>(null);
  const layerRef = React.useRef<Konva.Layer | null>(null);
  const trRef = React.useRef<Konva.Transformer | null>(null);
  const selectionRectRef = React.useRef<Konva.Rect | null>(null);

  const [layout, setLayout] = React.useState<Graph>(
    {
      nodes: [],
      edges: []
    });

  const [lines, setLines] = React.useState([] as any);
  const isDrawing = React.useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_nodesArray, setNodes] = React.useState([] as any);

  const oldPos = React.useRef(null);

  const selection = React.useRef({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const updateSelectionRect = () => {
    const node = selectionRectRef.current!!;
    node.setAttrs({
      visible: selection.current.visible,
      x: Math.min(selection.current.x1, selection.current.x2),
      y: Math.min(selection.current.y1, selection.current.y2),
      width: Math.abs(selection.current.x1 - selection.current.x2),
      height: Math.abs(selection.current.y1 - selection.current.y2),
      fill: 'rgba(0, 161, 255, 0.3)',
    });

    node.getLayer()!!.batchDraw();
  };

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);

      // for draw items ?
      onMouseDown(e);

      // @ts-ignore
      trRef.current.nodes([]);
      setNodes([]);
    }
  };

  // refs: https://jsbin.com/rumizocise/1/edit?html,js,output
  const onMouseUp = (_e: Konva.KonvaEventObject<MouseEvent>) => {
    isDrawing.current = false;

    oldPos.current = null;
    if (!selection.current.visible) {
      return;
    }
    const selBox = selectionRectRef.current!!.getClientRect();

    const elements: any[] = [];
    layerRef.current!!.find(FK_RECT_NAME).forEach((elementNode) => {
      const elBox = elementNode.getClientRect();
      if (Konva.Util.haveIntersection(selBox, elBox)) {
        elements.push(elementNode);
      }
    });

    trRef.current!!.nodes(elements);
    selection.current.visible = false;
    // disable click event
    // @ts-ignore
    Konva.listenClickTap = false;
    updateSelectionRect();
  };

  const onMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    // @ts-ignore
    const pos = e.target.getStage().getPointerPosition()!!;
    // @ts-ignore
    setLines([...lines, [pos.x, pos.y]]);

    const isElement = e.target.findAncestor('.elements-container');
    const isTransformer = e.target.findAncestor('Transformer');
    if (isElement || isTransformer) {
      return;
    }

    selection.current.visible = true;
    selection.current.x1 = pos.x;
    selection.current.y1 = pos.y;
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;

    updateSelectionRect();
  };

  const onMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // if(process.env.NODE_ENV === 'development') {
    //   const state = stageRef.current?.getStage().getPointerPosition();
    //   if (state != null) {
    //     const text = `Cursor position is: ${state.x}, ${ state.y }`;
    //     console.log(text);
    //   }
    // }
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }

    const stage: Konva.Stage = e.target.getStage()!!;
    const point = stage.getPointerPosition()!!;
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine = lastLine.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());

    if (!selection.current.visible) {
      return;
    }
    const pos = stage.getPointerPosition()!!;
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  };

  const onMouseOut = (_e: Konva.KonvaEventObject<MouseEvent>) => {
  };

  // based on: https://codesandbox.io/s/react-konva-multiple-selection-tgggi?file=/src/index.js:312-320
  const onClickTap = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // if we are selecting with rect, do nothing
    // if (selectionRectangle.visible()) {
    //   return;
    // }
    let stage = e.target.getStage();
    let layer = layerRef.current!!;
    let tr = trRef.current!!;
    // if click on empty area - remove all selections
    if (e.target === stage) {
      selectShape(null);
      setNodes([]);
      tr.nodes([]);
      layer.draw();
      return;
    }

    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName(FK_RECT_NAME)) {
      return;
    }

    // do we press shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = tr.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected just one
      tr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      const nodes = tr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(e.target), 1);
      tr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      const nodes = tr.nodes().concat([e.target]);
      tr.nodes(nodes);
    }
    layer.draw();
  };

 useEffect(() => {
   try {
     const executor = new DotImporter(props.text);
     let graph = executor.parse();
     setLayout(graph);
     props.history.save(props.text);
   } catch (e) {
     console.error(e);
   }
 }, [props.history, props.text]);

  return (
    <Stage
      ref={ stageRef }
      width={ window.innerWidth / 2 - 200 }
      height={ window.innerHeight - 200 }
      onMouseDown={ checkDeselect }
      onMouseUp={ onMouseUp }
      onMouseMove={ onMouseMove }
      onMouseOut={ onMouseOut }
      onClick={ onClickTap }
      onTouchStart={ checkDeselect }
    >
      <Layer ref={ layerRef }>
        { layout.nodes.map((node: Node) => NodeRender(node)) }
        { layout.edges.map((edge: Edge) => EdgeShape(edge)) }

        <Transformer
          ref={ trRef }
          boundBoxFunc={ (oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }

            return newBox;
          } }
        />
        <Rect fill="rgba(0,0,255,0.5)" ref={ selectionRectRef }/>
      </Layer>
    </Stage>
  );
}

export default Render;

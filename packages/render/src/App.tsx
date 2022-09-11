import React from 'react';
import { Box, Button, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { SupportedFileType } from "@feakin/exporter";

import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Render from "./components/Render";
import { ChangeHistory } from "./repository/change-history";
import { CodeProp, RenderOptions, SupportedCodeLang } from "./type";
import { HandDrawing } from "./graph/drawn-style/hand-drawing";
import { NavBar } from "./layout/nav-bar";
import { SupportedLayout } from "@feakin/exporter/src/layout/layout-engine";
import FkMonacoEditor from "./components/FkMonacoEditor";
import { webSocket } from "rxjs/webSocket";
import { randomId } from "./components/editor/subscribe-wrapper";

export const App = () => {
  const history = new ChangeHistory();
  // TODO: make url configurable
  const host = process.env.NODE_ENV === 'production' ? "wss://feakin.herokuapp.com" : "ws://localhost:8804";
  const [subject] = React.useState<any>(webSocket(`${ host }/living/edit`));
  const [formats, setFormats] = React.useState<string[]>(() => []);
  const [renderOptions, setRenderOptions] = React.useState<RenderOptions>({
    layout: SupportedLayout.Dagre,
    paintStyle: false,
    paintInstance: new HandDrawing()
  });

  // todo: add @{AppState} to store the code and history
  const [code, setCode] = React.useState({
    language: SupportedCodeLang.dot,
    sourceType: SupportedFileType.GRAPHVIZ,
    content: `digraph G {
  compound=true;
  subgraph cluster0 {
    a [shape="triangle", fillcolor=red, style=filled];
    b [shape="diamond"];
    a -> b;
    c -> d;
  }
  subgraph cluster1 {
    e -> g;
    e -> f;
  }
}`
  } as CodeProp);

  const updateRenderFormats = (event: React.MouseEvent<HTMLElement>, newFormats: string[],) => {
    const newOptions: RenderOptions = {};
    newOptions.paintStyle = newFormats.includes("paintStyle");
    setFormats(newFormats);
    setRenderOptions({
      ...renderOptions,
      ...newOptions
    })
  };

  const [roomId, setRoomId] = React.useState<string>("");

  const updateRoomId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(event.target.value);
  }

  const agentName = randomId();
  const joinRoom = () => {
    subject.next({ "type": "JoinRoom", "value": { "room_id": roomId, "agent_name": agentName } });
  }

  return (
    <div>
      <NavBar code={ code } setCode={ setCode }/>
      <Grid2 container spacing={ 1 }>
        <Grid2 xs={ 6 }>
          <Box sx={ { display: 'flex', alignItems: 'center', md: 'flex', '& > :not(style)': { m: 1 } } }>
            <TextField id="lang-name" disabled size="small" label="Language" value={ code.language }/>
            <TextField id="source-type" disabled size="small" label="Source Type" value={ code.sourceType }/>
            <TextField id="roomId" size="small" label="Room Id" value={ roomId } onChange={ updateRoomId }/>
            <Button size={ "small" } onClick={ joinRoom }>Join</Button>
          </Box>
          <FkMonacoEditor code={ code }
                          updateCode={ setCode }
                          subject={ subject }
                          room={ roomId }
                          setRoomId={ setRoomId }
                          agentName={ agentName }
          />
        </Grid2>
        <Grid2 xs={ 6 }>
          <Box sx={ { display: 'flex', alignItems: 'center', md: 'flex', '& > :not(style)': { m: 1 } } }>
            <ToggleButtonGroup value={ formats } onChange={ updateRenderFormats }>
              <ToggleButton value="paintStyle" aria-label="Paint Style" size={ "small" }>
                <DriveFileRenameOutlineIcon/>
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField id="layout-style" disabled size="small" label="Layout Style" value={ renderOptions.layout }/>
          </Box>
          <Render code={ code } history={ history } options={ renderOptions }/>
        </Grid2>
      </Grid2>
    </div>
  );
};

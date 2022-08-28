import React from 'react';
import { Box, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { SupportedFileType } from "@feakin/exporter";
import MonacoEditor from "react-monaco-editor";

import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Render from "./components/Render";
import { addDotLang } from "./components/editor/dot-lang";
import { ChangeHistory } from "./repository/change-history";
import { CodeProp, SupportedCodeLang } from "./type";
import { RenderOptions } from "./components/render-options";
import { HandDrawing } from "./graph/drawn-style/hand-drawing";
import { NavBar } from "./layout/nav-bar";


const App = () => {
  const history = new ChangeHistory();
  const [formats, setFormats] = React.useState<string[]>(() => []);
  const [renderOptions, setRenderOptions] = React.useState<RenderOptions>({
    paintStyle: false,
    paintInstance: new HandDrawing()
  });

  // todo: add AppState to store the code and history
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

  const handleTextChange = (newValue: string) => {
    setCode({
      ...code,
      content: newValue
    });
  }

  const editorDidMount = (editor: any, monaco: any) => {
    addDotLang(monaco);
    editor.focus();
  }

  const updateRenderFormats = (event: React.MouseEvent<HTMLElement>, newFormats: string[],) => {
    const newOptions: RenderOptions = {};
    newOptions.paintStyle = newFormats.includes("paintStyle");
    setFormats(newFormats);
    setRenderOptions({
      ...renderOptions,
      ...newOptions
    })
  };

  return (
    <div>
      <NavBar code={ code } setCode={ setCode }/>
      <Grid2 container spacing={ 1 }>
        <Grid2 xs={ 6 }>
          <Box sx={ { display: 'flex', alignItems: 'center', md: 'flex', '& > :not(style)': { m: 1 } } }>
            <TextField id="lang-name" disabled size="small" label="Language" value={ code.language }/>
            <TextField id="type" disabled size="small" label="Source Type" value={ code.sourceType }/>
          </Box>
          <MonacoEditor
            width="100%"
            height={ window.innerHeight - 200 }
            language={ code.language }
            theme="vs-dark"
            value={ code.content }
            onChange={ handleTextChange }
            editorDidMount={ editorDidMount }
          />
        </Grid2>
        <Grid2 xs={ 6 }>
          <Box sx={ { display: 'flex', alignItems: 'center', md: 'flex', '& > :not(style)': { m: 1 } } }>
            <ToggleButtonGroup value={ formats } onChange={ updateRenderFormats }>
              <ToggleButton value="paintStyle" aria-label="Paint Style" size={ "small" }>
                <DriveFileRenameOutlineIcon/>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Render code={ code } history={ history } options={ renderOptions }/>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default App;

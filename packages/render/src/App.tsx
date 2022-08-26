import React, { useRef } from 'react';
import Render from "./components/Render";
import {
  AppBar,
  Box,
  Button, IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import GitHubIcon from '@mui/icons-material/GitHub';
import { Converter, OnlineRender } from "@feakin/exporter";
import MonacoEditor from "react-monaco-editor";
import * as monacoEditor from "monaco-editor";
import { addDotLang } from "./components/editor/dot-lang";
import { ChangeHistory } from "./repository/change-history";

const DOT_LANG = "dot";
const App = () => {
  const history = new ChangeHistory();
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [text, setText] = React.useState(`digraph G {
  compound=true;
  subgraph cluster0 {
    a [shape="triangle"];
    b [shape="diamond"];
    a -> b;
    c -> d;
  }
  subgraph cluster1 {
    e -> g;
    e -> f;
  }
}`);
  const [fileEl, setFileEl] = React.useState<null | HTMLElement>(null);
  const [exportEl, setExportEl] = React.useState<null | HTMLElement>(null);
  const [templateEl, setTemplateEl] = React.useState<null | HTMLElement>(null);

  const isOpenFileMenu = Boolean(fileEl);
  const isOpenExportMenu = Boolean(exportEl);
  const isOpenTemplateMenu = Boolean(templateEl);

  const handleFieMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFileEl(event.currentTarget);
  };

  const handleFileMenuClose = () => {
    setFileEl(null);
  };

  const handleTemplateMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTemplateEl(event.currentTarget);
  };

  const handleTemplateMenuClose = () => {
    setTemplateEl(null);
  };

  const handleExportMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportEl(null);
  };

  const exportFile = (outputType: string) => {
    let output = Converter.fromContent(text, DOT_LANG).target(outputType);

    const element = document.createElement("a");
    const file = new Blob([output], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "feakin-export." + outputType;
    document.body.appendChild(element);
    element.click();

    setExportEl(null);
  }

  const importFile = () => {
    if (inputFile.current != null) {
      inputFile.current.click();
    }

    setFileEl(null);
  }

  function getExtension(filename: string) {
    return filename.split('.').pop();
  }

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      let ext = getExtension(file.name);
      if (ext) {
        file.text().then(text => {
          setText(Converter.fromContent(text, ext as string).target(DOT_LANG));
        });
      }
    }
  }

  const onlineRender = (typ: string) => {
    switch (typ) {
      case "graphviz":
        window.open(OnlineRender.buildDotUrl(text));
        break;
      case "mermaid":
        let graphText = Converter.fromContent(text, DOT_LANG).target("mermaid");
        window.open(OnlineRender.buildMermaidUrl(graphText));
        break;
      default:
        console.error("unknown " + typ);
    }
  }

  const handleTextChange = (newValue: string, event: monacoEditor.editor.IModelContentChangedEvent) => {
    setText(newValue);
  }

  const editorDidMount = (editor: any, monaco: any) => {
    addDotLang(monaco);
    editor.focus();
  }

  let exportMenus = <Menu
    id="export-menu"
    anchorEl={ exportEl }
    open={ isOpenExportMenu }
    onClose={ handleExportMenuClose }
    MenuListProps={ {
      'aria-labelledby': 'basic-button',
    } }
  >
    <MenuItem onClick={ () => exportFile(DOT_LANG) }>Dot</MenuItem>
    <MenuItem onClick={ () => exportFile('drawio') }>Draw.io</MenuItem>
    <MenuItem onClick={ () => exportFile('excalidraw') }>Excalidraw</MenuItem>
  </Menu>;

  let fileMenus = <Menu
    id="file-menu"
    anchorEl={ fileEl }
    open={ isOpenFileMenu }
    anchorOrigin={ {
      vertical: 'bottom',
      horizontal: 'left',
    } }
    keepMounted
    transformOrigin={ {
      vertical: 'top',
      horizontal: 'left',
    } }
    onClose={ handleFileMenuClose }
    MenuListProps={ {
      'aria-labelledby': 'basic-button',
    } }
  >
    <MenuItem onClick={ importFile }>
      <Typography textAlign="center">Import</Typography>
    </MenuItem>
  </Menu>;

  let templateMenus = <><Button
    sx={ { my: 2, color: 'white', display: 'block' } }
    aria-controls={ isOpenTemplateMenu ? 'template-menu' : undefined }
    aria-haspopup="true"
    aria-expanded={ isOpenTemplateMenu ? 'true' : undefined }
    onClick={ handleTemplateMenuClick }
  >
    Templates
  </Button>
    <Menu
      id="template-menu"
      anchorEl={ templateEl }
      open={ isOpenTemplateMenu }
      onClose={ handleTemplateMenuClose }
    >
      <MenuItem>
        <Typography textAlign="center">Coming soon</Typography>
      </MenuItem>
    </Menu></>;

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Box sx={ { display: { xs: 'none', md: 'flex', flexGrow: 1 } } }>
            <Button
              id="basic-button"
              sx={ { my: 2, color: 'white', display: 'block' } }
              aria-controls={ isOpenFileMenu ? 'file-menu' : undefined }
              aria-haspopup="true"
              aria-expanded={ isOpenFileMenu ? 'true' : undefined }
              onClick={ handleFieMenuClick }
            >
              File
            </Button>
            { fileMenus }
            { templateMenus }
            <Button
              sx={ { my: 2, color: 'white', display: 'block' } }
              aria-controls={ isOpenFileMenu ? 'export-menu' : undefined }
              aria-haspopup="true"
              aria-expanded={ isOpenFileMenu ? 'true' : undefined }
              onClick={ handleExportMenuClick }
            >
              Export
            </Button>
            { exportMenus }
          </Box>
          <Box sx={ { display: { xs: 'none', md: 'flex' } } }>
            <Button sx={ { my: 2, color: 'white', display: 'block' } } onClick={ () => onlineRender('graphviz') }>
              Online Render (Graphviz) </Button>
            <Button sx={ { my: 2, color: 'white', display: 'block' } } onClick={ () => onlineRender('mermaid') }>
              Online Render (Mermaid)
            </Button>

            <IconButton onClick={ () => window.open("https://github.com/feakin/feakin") } size="large"
                        aria-label="GitHub" color="inherit">
              <GitHubIcon/>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Grid2 container spacing={ 3 }>
        <input type='file' id='file' ref={ inputFile } style={ { display: 'none' } } onChange={ onChangeFile }/>
        <Grid2 xs={ 6 }>
          <MonacoEditor
            width="100%"
            height={ window.innerHeight - 200 }
            language="dot"
            theme="vs-dark"
            value={ text }
            onChange={ handleTextChange }
            editorDidMount={ editorDidMount }
          />
        </Grid2>
        <Grid2 xs={ 6 }>
          <Render text={ text } history={ history }/>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default App;

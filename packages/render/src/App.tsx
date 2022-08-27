import React, { useRef } from 'react';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import GitHubIcon from '@mui/icons-material/GitHub';
import { Converter, OnlineRender, SupportedFileType } from "@feakin/exporter";
import MonacoEditor from "react-monaco-editor";

import Render from "./components/Render";
import { addDotLang } from "./components/editor/dot-lang";
import { ChangeHistory } from "./repository/change-history";
import { fileExport } from "./actions/file-export";
import { extToCodeType, getExtension } from "./helper/file-ext";
import { templates } from "./templates/frontend-backend";
import { FkTemplate } from "./templates/fk-template";
import { CodeProp, SupportedCodeLang } from "./type";

const DOT_LANG = "dot";

const App = () => {
  const history = new ChangeHistory();
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [code, setCode] = React.useState({
    language: SupportedCodeLang.dot,
    sourceType: SupportedFileType.GRAPHVIZ,
    content: `digraph G {
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
}`
  } as CodeProp);
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
    const outputCode = Converter.fromContent(code.content, code.sourceType).target(outputType);
    fileExport(outputCode, outputType);
    setExportEl(null);
  }

  const importFile = () => {
    if (inputFile.current != null) {
      inputFile.current.click();
    }

    setFileEl(null);
  }

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      let ext = getExtension(file.name);
      if (ext == null) {
        alert("not support type, for example: .dot, .mermaid, .excalidraw");
        return;
      }

      let codeType = extToCodeType(ext!);
      if (codeType != null) {
        file.text().then(text => {
          setCode({
            language: codeType!.lang,
            sourceType: codeType!.sourceType,
            content: text
          });
        });
      } else {
        alert("not support type, for example: .dot, .mermaid, .excalidraw");
      }
    }
  }

  const onlineRender = (typ: string) => {
    let converter = Converter.fromContent(code.content, DOT_LANG);
    switch (typ) {
      case "graphviz":
        window.open(OnlineRender.buildDotUrl(converter.target("graphviz")));
        break;
      case "mermaid":
        window.open(OnlineRender.buildMermaidUrl(converter.target("mermaid")));
        break;
      default:
        console.error("unknown " + typ);
    }
  }

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
      { templates.map((template: FkTemplate, index: number) =>
        <MenuItem key={ `key-` + index } onClick={ () => setCode(template.template) }>
          <Typography textAlign="center">{ template.label }</Typography>
        </MenuItem>
      ) }
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
            language={ code.language }
            theme="vs-dark"
            value={ code.content }
            onChange={ handleTextChange }
            editorDidMount={ editorDidMount }
          />
        </Grid2>
        <Grid2 xs={ 6 }>
          <Render code={ code } history={ history }/>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default App;

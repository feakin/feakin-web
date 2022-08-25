import React from 'react';
import Render from "./Render";
import { AppBar, Button, Container, Menu, MenuItem, TextareaAutosize, Toolbar, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Converter, OnlineRender } from "@feakin/exporter";

const App = () => {
  const [text, setText] = React.useState(`graph TD;
    A-->B
    A-->C
    B-->C;`);
  const [fileEl, setFileEl] = React.useState<null | HTMLElement>(null);
  const [exportEl, setExportEl] = React.useState<null | HTMLElement>(null);
  const isOpenFileMenu = Boolean(fileEl);
  const isOpenExportMenu = Boolean(exportEl);

  const handleFieMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFileEl(event.currentTarget);
  };

  const handleFileMenuClose = () => {
    setFileEl(null);
  };

  const handleExportMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setExportEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportEl(null);
  };

  const importFile = () => {
    console.log("importFile");
  }

  const onlineRender = (typ: string) => {
    switch (typ) {
      case "graphviz":
        let graphText = Converter.fromContent(text, "mermaid").target("dot");
        window.open(OnlineRender.buildDotUrl(graphText));
        break;
      case "mermaid":
        window.open(OnlineRender.buildMermaidUrl(text));
        break;
      default:
        console.error("unknown " + typ);
    }
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={ { flexGrow: 1 } }>
          <Typography variant="h6" noWrap component="a">FEAKIN</Typography>
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
          <Menu
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
          </Menu>
          <Button
            sx={ { my: 2, color: 'white', display: 'block' } }
            aria-controls={ isOpenFileMenu ? 'export-menu' : undefined }
            aria-haspopup="true"
            aria-expanded={ isOpenFileMenu ? 'true' : undefined }
            onClick={ handleExportMenuClick }
          >
            Export
          </Button>
          <Menu
            id="export-menu"
            anchorEl={ exportEl }
            open={ isOpenExportMenu }
            onClose={ handleExportMenuClose }
            MenuListProps={ {
              'aria-labelledby': 'basic-button',
            } }
          >
            <MenuItem onClick={ importFile }>Dot</MenuItem>
            <MenuItem onClick={ importFile }>Graphviz</MenuItem>
            <MenuItem onClick={ importFile }>Mermaid</MenuItem>
            <MenuItem onClick={ importFile }>Excalidraw</MenuItem>
          </Menu>
          <Button sx={ { my: 2, color: 'white', display: 'block' } } onClick={ () => onlineRender('graphviz') }>Online
            Render (Graphviz) </Button>
          <Button sx={ { my: 2, color: 'white', display: 'block' } } onClick={ () => onlineRender('mermaid') }>Online
            Render (Mermaid) </Button>
        </Toolbar>
      </AppBar>
      <Grid2 container spacing={ 3 }>
        <Grid2 xs={ 6 }>
          <TextareaAutosize
            aria-label="minimum height"
            value={ text }
            onChange={ handleTextChange }
            minRows={ 6 }
            placeholder="Minimum 3 rows"
          />
        </Grid2>
        <Grid2 xs={ 6 }>
          <Render text={ text }/>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default App;

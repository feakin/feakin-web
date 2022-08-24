import React, { ChangeEventHandler } from 'react';
import Render from "./Render";
import { Button, Menu, MenuItem, TextareaAutosize } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

const App = () => {
  const [text, setText] = React.useState(`graph TD;
    A-->B
    A-->C
    B-->C;`);
  const [fileEl, setFileEl] = React.useState<null | HTMLElement>(null);
  const [exportEl, setExportEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(fileEl);

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

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  }

  return (
    <div>
      <Grid2 container spacing={3}>
        <Grid2 xs={6} md={6}>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleFieMenuClick}
          >
            File
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={fileEl}
            open={open}
            onClose={handleFileMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={importFile}>Import</MenuItem>
          </Menu>
        </Grid2>
        <Grid2 xs={6}>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleExportMenuClick}
          >
            Export
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={exportEl}
            open={open}
            onClose={handleFileMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={importFile}>Dot</MenuItem>
            <MenuItem onClick={importFile}>Graphviz</MenuItem>
            <MenuItem onClick={importFile}>Mermaid</MenuItem>
            <MenuItem onClick={importFile}>Excalidraw</MenuItem>
          </Menu>
          <Button onClick={handleExportMenuClick}>Online (Dot) </Button>
          <Button onClick={handleExportMenuClick}>Online (Graphviz) </Button>
        </Grid2>
        <Grid2 xs={6}>
          <TextareaAutosize
            aria-label="minimum height"
            value={text}
            onChange={handleTextChange}
            minRows={6}
            placeholder="Minimum 3 rows"
          />
        </Grid2>
        <Grid2 xs={6}>
          <Render text={ text }/>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default App;

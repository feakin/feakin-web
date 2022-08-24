import React from 'react';
import Render from "./Render";
import { Button, Menu, MenuItem, TextareaAutosize } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

const App = () => {
  const [fileEl, setFileEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(fileEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFileEl(event.currentTarget);
  };
  const handleClose = () => {
    setFileEl(null);
  };

  const importFile = () => {
    console.log("importFile");
  }

  const text = `graph TD;
    A-->B
    A-->C
    B-->C;`;

  return (
    <div>
      <Grid2 container spacing={3}>
        <Grid2 xs={6} md={6}>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            File
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={fileEl}
            open={open}
            onClose={handleClose}
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
            onClick={handleClick}
          >
            Export
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={fileEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={importFile}>Dot</MenuItem>
            <MenuItem onClick={importFile}>Graphviz</MenuItem>
            <MenuItem onClick={importFile}>Mermaid</MenuItem>
            <MenuItem onClick={importFile}>Excalidraw</MenuItem>
          </Menu>
        </Grid2>
        <Grid2 xs={6}>
          <TextareaAutosize
            aria-label="minimum height"
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

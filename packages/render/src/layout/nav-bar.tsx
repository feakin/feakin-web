import React, { useRef } from "react";
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Converter } from "@feakin/exporter";
import { fileExport } from "../actions/file-export";
import { extToCodeType, getExtension } from "../helper/file-ext";
import { FkTemplate } from "../templates/fk-template";
import { templates } from "../templates/templates";
import { CodeProp } from "../type";

const DOT_LANG = "dot";

export function NavBar(props: { code: CodeProp, setCode: (code: CodeProp) => void }) {
  const [fileEl, setFileEl] = React.useState<null | HTMLElement>(null);
  const [exportEl, setExportEl] = React.useState<null | HTMLElement>(null);
  const [templateEl, setTemplateEl] = React.useState<null | HTMLElement>(null);
  const inputFile = useRef<HTMLInputElement | null>(null);

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
    const outputCode = Converter.fromContent(props.code.content, props.code.sourceType).target(outputType);
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
          props.setCode({
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

  function selectTemplate(template: FkTemplate) {
    props.setCode(template.template);
    setTemplateEl(null);
  }

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
        <MenuItem key={ `key-` + index } onClick={ () => selectTemplate(template) }>
          <Typography textAlign="center">{ template.label }</Typography>
        </MenuItem>
      ) }
    </Menu></>;

  return <AppBar position="static">
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
        <IconButton onClick={ () => window.open("https://github.com/feakin/feakin") } size="large"
                    aria-label="GitHub" color="inherit">
          <GitHubIcon/>
        </IconButton>
      </Box>
    </Toolbar>

    <input type='file' id='file' ref={ inputFile } style={ { display: 'none' } } onChange={ onChangeFile }/>
  </AppBar>;
}

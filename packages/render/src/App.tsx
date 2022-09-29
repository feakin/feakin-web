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
import FkMonacoEditor from "./components/editor/FkMonacoEditor";
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
    language: SupportedCodeLang.fkl,
    sourceType: SupportedFileType.Feakin,
    content: `ContextMap TicketBooking {
  Reservation -> Cinema;
  Reservation -> Movie;
  Reservation -> User;
}

Context Reservation {
  Aggregate Reservation;
}

Aggregate Reservation {
  Entity Ticket, Reservation;
}

Entity Reservation  {
  Struct {
    id: String;
    token: UUID;
    status: ReservationStatus = ReservationStatus.OPEN;
    expiresAt: LocalDateTime;
    createdAt: LocalDateTime;
    screeningId: String;
    screeningStartTime: LocalDateTime;
    name: String;
    surname: String;
    tickets: Set<Ticket>;
    totalPrice: BigDecimal;
  }
}

Entity Ticket  {}

Context Cinema {
  Aggregate Cinema;
}

Aggregate Cinema {
  Entity Cinema, ScreeningRoom, Seat;
}

Entity Cinema { }
Entity ScreeningRoom { }
Entity Seat { }

Context Movie {
  Aggregate Movie;
}

Aggregate Movie {
  Entity Movie, Actor, Publisher;
}

Entity Movie { }
Entity Actor { }
Entity Publisher { }

Context User {
  Aggregate User;
}

Aggregate User {
  Entity User;
}

Entity User {
  Struct {
    id: UUID;
    mobile: String;
    email: String;
    username: String;
    password: String;
    address: String;
  }
}

Entity Payment {
  Struct {
    id: UUID;
    amount: BigDecimal;
    currency: Currency;
    status: PaymentStatus;
    createdAt: LocalDateTime;
  }
}

ValueObject Price { }
ValueObject Notifications { }
`
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

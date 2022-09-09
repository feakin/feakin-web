import MonacoEditor from "react-monaco-editor";
import React, { useCallback, useEffect, useState } from "react";
import { WebSocketSubject } from "rxjs/webSocket";
import { editor } from "monaco-editor";
import { Buffer } from "buffer";

import { addDotLangSupport } from "./editor/dot-lang";
import { CodeProp } from "../type";
import { createWrapper, initBasicWasm } from "./editor/subscribe-wrapper";
import { ClientOpts } from "@braid-protocol/client";
import { Doc, OpLog } from "diamond-types-web";

export interface FkUpstream {
  version: string;
  patch: Uint8Array;
}

export interface FkResponse {
  type: string;
  value: any | FkUpstream;
}

function FkMonacoEditor(props: { code: CodeProp, subject: WebSocketSubject<any>, updateCode: (code: CodeProp) => void, room: string, setRoomId: (roomId: string) => void }) {
  const [roomId, setRoomId] = React.useState<string>(props.room);
  const [subject] = React.useState<WebSocketSubject<any>>(props.subject);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editor, setEditor] = React.useState<editor.IStandaloneCodeEditor>();
  // @ts-ignore
  const [braid, setBraid] = React.useState<ClientOpts>(null);

  useEffect(() => {
    setRoomId(props.room);
  }, [props.room]);

  const [isLoadingWasm, setIsLoadingWasm] = useState(Boolean);

  useEffect(() => {
    if (!isLoadingWasm) {
      initBasicWasm().then((wasm) => {
        setIsLoadingWasm(true);
      });
    }
  });

  function initDoc(content: any, type: string) {
    let wrapper = createWrapper();

    switch (type) {
      case "CreateRoom": {
        setBraid(createWrapper());
        break;
      }
      case "Join": {
        let buffer = Buffer.from(content);
        console.log(buffer);
        let doc = Doc.fromBytes([] as any, "agent");
        doc.merge(buffer as any);
        // let opLog: OpLog = OpLog.fromBytes(buffer, "agent");

        // console.log(doc);
        // let doc = wrapper.parseDoc!("application/diamond-types", buffer);
        // console.log(doc);
        setBraid(wrapper);
        break;
      }
    }
  }

  useEffect(() => {
    subject.subscribe({
      next: (msg: FkResponse) => {
        if (roomId.length === 0 && msg.type === "CreateRoom") {
          props.setRoomId(msg.value.room_id);
          setRoomId(msg.value.room_id);

          // todo: make return from backend?
          // initDoc(props.code.content, "CreateRoom");
          return;
        }

        if (msg.type === "Join") {
          initDoc(msg.value.content, "Join");
        }

        // update from patch
        if (msg.type === "Upstream") {
          updateFromPatch(msg);
          return;
        }

        console.log(msg);
      },
      error: (err: any) => console.log(err),
      complete: () => console.log('complete')
    });

    if (roomId.length <= 0) {
      subject.next({ "type": "CreateRoom", "value": { "agent_name": "agent", "content": props.code.content } });
    }
  });

  function updateFromPatch(msg: FkResponse) {
    // todo: add init from content;
    let patch = Buffer.from(msg.value.patch);
    console.log(patch);
    console.log(braid.parseDoc!("string", patch));

    // const { start, end, text } = msg.value;
    // editor?.executeEdits("fk", new editor.EditOperation(start, end, text));
    // subscribe
  }

  const handleTextChange = useCallback((newValue: string, event: editor.IModelContentChangedEvent) => {
    event.changes.sort((change1, change2) => change2.rangeOffset - change1.rangeOffset).forEach(change => {
      // todo: wrapper to API
      subject.next({
        type: "Insert",
        value: { content: change.text, pos: change.rangeOffset, room_id: roomId }
      });

      if (change.rangeLength > 0) {
        subject.next({
          type: "Delete",
          value: {
            range: { start: change.rangeOffset, end: change.rangeOffset + change.rangeLength - 1 },
            room_id: roomId
          }
        })
      }
    })

    props.updateCode({
      ...props.code,
      content: newValue
    });
  }, [props, subject, roomId]);

  const editorDidMount = useCallback((editor: any, monaco: any) => {
    addDotLangSupport(monaco);
    editor.layout();
    editor.focus();

    setEditor(editor);
  }, []);

  return <MonacoEditor
    width="100%"
    height="100vh"
    language={ props.code.language }
    theme="vs-dark"
    value={ props.code.content }
    onChange={ handleTextChange }
    editorDidMount={ editorDidMount }
    options={ {
      wrappingIndent: "indent",
      wordWrap: "on",
    } }
  />;
}

export default FkMonacoEditor;

import MonacoEditor from "react-monaco-editor";
import React, { useCallback, useEffect, useState } from "react";
import { WebSocketSubject } from "rxjs/webSocket";
import { editor, Selection } from "monaco-editor";
import { Buffer } from "buffer";

import { addDotLangSupport } from "./editor/dot-lang";
import { CodeProp } from "../type";
import { createWrapper, initBasicWasm, randomId } from "./editor/subscribe-wrapper";
import { ClientOpts } from "@braid-protocol/client";
import { Doc, OpLog } from "@feakin/diamond-types-web";

export interface FkUpstream {
  version: string;
  patch: Uint8Array;
}

export interface FkPatch {
  before: Uint32Array;
  after: Uint32Array;
  patch: Uint8Array;
}

export interface FkResponse {
  type: string;
  value: any | FkUpstream | FkPatch;
}

export type DTOp = { kind: 'Ins' | 'Del', start: number, end: number, fwd?: boolean, content?: string }

interface FkMonacoEditorParams {
  code: CodeProp;
  subject: WebSocketSubject<any>;
  updateCode: (code: CodeProp) => void;
  room: string;
  agentName: string;
  setRoomId: (roomId: string) => void;
}

function FkMonacoEditor(props: FkMonacoEditorParams) {
  const [roomId, setRoomId] = React.useState<string>(props.room);
  const [subject] = React.useState<WebSocketSubject<any>>(props.subject);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editor, setEditor] = React.useState<editor.IStandaloneCodeEditor>();

  const [doc, setDoc] = React.useState<Doc>(null as any);
  const [isLoadingWasm, setIsLoadingWasm] = useState(false);

  const [content, setContent] = React.useState<string>(props.code.content);

  useEffect(() => {
    setRoomId(props.room);
  }, [props.room]);

  useEffect(() => {
    if (!isLoadingWasm) {
      initBasicWasm().then((wasm) => {
        setIsLoadingWasm(true);
      });
    }
  });

  const initDoc = useCallback((content: any, type: string) => {
    switch (type) {
      case "CreateRoom": {
        let opLog = new OpLog();
        opLog.setAgent(props.agentName);
        opLog.ins(0, props.code.content);

        let fromDoc = Doc.fromBytes(opLog.toBytes(), props.agentName);

        setDoc(fromDoc);
        break;
      }
      case "Join": {
        let doc = Doc.fromBytes(content as any, props.agentName)

        setDoc(doc);
        setContent(doc.get());
        break;
      }
      default: {
        console.log("unknown type");
      }
    }
  }, [props.agentName, props.code.content])

  const [patchInfo, setPatchInfo] = React.useState<FkPatch>(null as any);

  useEffect(() => {
    if (!isLoadingWasm) {
      return;
    }

    subject.subscribe({
      next: (msg: FkResponse) => {
        if (roomId.length === 0 && msg.type === "CreateRoom") {
          initDoc(msg.value.content, "CreateRoom");

          props.setRoomId(msg.value.room_id);
          setRoomId(msg.value.room_id);
          return;
        }

        if (msg.type === "Join") {
          initDoc(msg.value.content, "Join");
          return;
        }

        if (msg.type === "Upstream") {
          setPatchInfo(msg.value);
          return;
        }
      },
      error: (err: any) => console.log(err),
      complete: () => console.log('complete')
    });

    if (roomId.length <= 0) {
      // Todo: change content to be a json object? But since is same library? will be generate same version?
      subject.next({ "type": "CreateRoom", "value": { "agent_name": props.agentName, "content": props.code.content } });
    }
  }, [props.agentName, initDoc, isLoadingWasm, props, roomId.length, subject]);

  useEffect(() => {
    // Todo: apply patchInfo refactor;
    if (patchInfo) {
      try {
        let merge_version = doc.mergeBytes(Buffer.from(patchInfo.patch))
        let newVersion = doc.mergeVersions(doc.getLocalVersion(), merge_version);
        console.log(newVersion);
        setDoc(doc);

        let xfSinces: DTOp[] = doc.xfSince(patchInfo.before);
        xfSinces.forEach((op) => {
          switch (op.kind) {
            case "Ins": {
              let monacoModel = editor!.getModel();
              const pos = monacoModel!.getPositionAt(op.start);
              const range = new Selection(pos.lineNumber, pos.column, pos.lineNumber, pos.column)
              monacoModel?.applyEdits([{ range, text: op.content! }])
              break;
            }
            case "Del": {
              let monacoModel = editor!.getModel();
              const start = monacoModel!.getPositionAt(op.start);
              const end = monacoModel!.getPositionAt(op.end);
              const range = new Selection(start.lineNumber, start.column, end.lineNumber, end.column)
              monacoModel?.applyEdits([{ range, text: "" }])
              break;
            }
            default: {
              console.log("unknown op: ", op);
            }
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [doc, editor, patchInfo]);

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
            range: { start: change.rangeOffset, end: change.rangeOffset + change.rangeLength },
            room_id: roomId
          }
        })
      }
    })

    props.updateCode({
      ...props.code,
      content: newValue
    });

    setContent(newValue);
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
    value={ content }
    onChange={ handleTextChange }
    editorDidMount={ editorDidMount }
    options={ {
      wrappingIndent: "indent",
      wordWrap: "on",
    } }
  />;
}

export default FkMonacoEditor;


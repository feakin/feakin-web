import MonacoEditor from "react-monaco-editor";
import React, { useCallback, useEffect, useState } from "react";
import { WebSocketSubject } from "rxjs/webSocket";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { editor, Selection } from "monaco-editor";
import { Buffer } from "buffer";

import { addDotLangSupport } from "./editor/dot-lang";
import { CodeProp } from "../type";
import { initBasicWasm } from "./editor/subscribe-wrapper";
import { Doc } from "@feakin/diamond-types-web";

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

export type DTOperation = { kind: 'Ins' | 'Del', start: number, end: number, fwd?: boolean, content?: string }

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
  const [editor, setEditor] = React.useState<editor.IStandaloneCodeEditor>();

  const [doc, setDoc] = React.useState<Doc>(null as any);

  const [isLoadingWasm, setIsLoadingWasm] = useState(false);

  const [content, setContent] = React.useState<string>(props.code.content);

  useEffect(() => {
    setRoomId(props.room);
    if (subject) {
      // logout
      subject.next({ "type": "LeaveRoom", "value": { "room_id": props.room, "agent_name": props.agentName } });
    }
  }, [props.agentName, props.room, subject]);

  useEffect(() => {
    if (!isLoadingWasm) {
      initBasicWasm().then((_wasm) => {
        setIsLoadingWasm(true);
      });
    }
  });

  const [patchInfo, setPatchInfo] = React.useState<FkPatch>(null as any);

  useEffect(() => {
    if (!isLoadingWasm) {
      return;
    }

    subject.subscribe({
      next: (msg: FkResponse) => {
        if (roomId.length === 0 && msg.type === "CreateRoom") {
          props.setRoomId(msg.value.room_id);
          setRoomId(msg.value.room_id);

          let newDoc = Doc.fromBytes(msg.value.content as any, props.agentName);
          newDoc.localToRemoteVersion(newDoc.getLocalVersion());
          setDoc(newDoc);

          return;
        }

        if (msg.type === "Join") {
          let newDoc = Doc.fromBytes(msg.value.content as any, props.agentName)
          newDoc.localToRemoteVersion(newDoc.getLocalVersion());
          setDoc(newDoc);
          setContent(newDoc.get());
          return;
        }

        if (msg.type === "Upstream") {
          setApplyPatching(true);
          setPatchInfo(msg.value);
          return;
        }

        if (msg.type === "Patches") {
          setApplyPatching(true);
          setPatchInfo(msg.value);
          return;
        }
      },
      error: (err: any) => console.log(err),
      complete: () => console.log('complete')
    });

    // Todo: change content to be a json object? But since is same library? will be generate same version?
    if (roomId.length <= 0) {
      subject.next({ "type": "CreateRoom", "value": { "agent_name": props.agentName, "content": props.code.content } });
    }
  }, [props.agentName, isLoadingWasm, props, roomId.length, subject, setPatchInfo]);

  const [isApplyPatch, setApplyPatching] = React.useState<boolean>(false);

  useEffect(() => {
    if (!patchInfo) {
      return;
    }

    try {
      if (doc.getLocalVersion() === patchInfo.after) {
        return;
      }

      let bytes = Buffer.from(patchInfo.patch);

      let merge_version = doc.mergeBytes(bytes)
      let last_version = doc.mergeVersions(doc.getLocalVersion(), merge_version);
      doc.localToRemoteVersion(last_version);

      let xfSinces: DTOperation[] = doc.xfSince(patchInfo.before);
      xfSinces.forEach((op) => {
        switch (op.kind) {
          case "Ins": {
            let monacoModel = editor!.getModel();
            const pos = monacoModel!.getPositionAt(op.start);
            const range = new Selection(pos.lineNumber, pos.column, pos.lineNumber, pos.column)
            monacoModel?.applyEdits([{ range, text: op.content! }], false)
            break;
          }
          case "Del": {
            let monacoModel = editor!.getModel();
            const start = monacoModel!.getPositionAt(op.start);
            const end = monacoModel!.getPositionAt(op.end);
            const range = new Selection(start.lineNumber, start.column, end.lineNumber, end.column)
            monacoModel?.applyEdits([{ range, text: "" }], false)
            break;
          }
          default: {
            console.log("unknown op: ", op);
          }
        }
      });

      setApplyPatching(false);

      let content = doc.get();
      props.updateCode({
        ...props.code,
        content: content
      });

      setContent(content);
    } catch (e) {
      console.error(e);
    }
  }, [editor, patchInfo, doc, props]);

  const handleTextChange = useCallback((_newValue: string, event: editor.IModelContentChangedEvent) => {
    if (isApplyPatch) {
      return;
    }

    let localVersion = doc.getLocalVersion();

    event.changes.sort((change1, change2) => change2.rangeOffset - change1.rangeOffset).forEach(change => {
      doc.ins(change.rangeOffset, change.text);
      doc.del(change.rangeOffset, change.rangeLength);
    })

    let patches = doc.getPatchSince(localVersion);
    subject.next({
      type: "OpsByPatches",
      value: {
        room_id: roomId,
        agent_name: props.agentName,
        patches: Array.prototype.slice.call(patches)
      }
    })

    // todo: update by samples
    let content = doc.get();
    props.updateCode({
      ...props.code,
      content: content
    });

    setContent(content);
  }, [isApplyPatch, doc, subject, roomId, props]);

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


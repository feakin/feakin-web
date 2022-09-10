import MonacoEditor from "react-monaco-editor";
import React, { useCallback, useEffect, useState } from "react";
import { WebSocketSubject } from "rxjs/webSocket";
import { editor } from "monaco-editor";
import { Buffer } from "buffer";

import { addDotLangSupport } from "./editor/dot-lang";
import { CodeProp } from "../type";
import { createWrapper, initBasicWasm } from "./editor/subscribe-wrapper";
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

function FkMonacoEditor(props: { code: CodeProp, subject: WebSocketSubject<any>, updateCode: (code: CodeProp) => void, room: string, setRoomId: (roomId: string) => void }) {
  const [roomId, setRoomId] = React.useState<string>(props.room);
  const [subject] = React.useState<WebSocketSubject<any>>(props.subject);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editor, setEditor] = React.useState<editor.IStandaloneCodeEditor>();
  // @ts-ignore
  const [braid, setBraid] = React.useState<ClientOpts>(null);
  const [doc, setDoc] = React.useState<Doc>(null as any);
  const [isLoadingWasm, setIsLoadingWasm] = useState(false);
  const [agentName] = useState("feakin")

  const [content, setContent] = React.useState<string>(props.code.content);
  const [serverVersion, setServerVersion] = React.useState<any>(null);

  useEffect(() => {
    setRoomId(props.room);
  }, [props.room]);


  useEffect(() => {
    if (!isLoadingWasm) {
      initBasicWasm().then((wasm) => {
        let wrapper = createWrapper();
        setBraid(wrapper);

        setIsLoadingWasm(true);
      });
    }
  });

  function initDoc(content: any, type: string) {
    switch (type) {
      case "CreateRoom": {
        let opLog = new OpLog();
        opLog.setAgent(agentName);
        opLog.ins(0, props.code.content);

        let fromDoc = Doc.fromBytes(opLog.toBytes(), agentName);
        setDoc(fromDoc);
        break;
      }
      case "Join": {
        let doc = Doc.fromBytes(content as any, agentName)
        let version = doc.getLocalVersion()

        setDoc(doc);
        setContent(doc.get());
        setServerVersion(version);
        break;
      }
      default: {
        console.log("unknown type");
      }
    }
  }

  const [patchInfo, setPatchInfo] = React.useState<FkPatch>(null as any);

  useEffect(() => {
    if (!isLoadingWasm) {
      return;
    }

    subject.subscribe({
      next: (msg: FkResponse) => {
        console.log(msg);

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
          // @ts-ignore
          setPatchInfo(msg.value);
          return;
        }
      },
      error: (err: any) => console.log(err),
      complete: () => console.log('complete')
    });

    if (roomId.length <= 0) {
      subject.next({ "type": "CreateRoom", "value": { "agent_name": agentName, "content": props.code.content } });
    }
  }, [isLoadingWasm]);

  useEffect(() => {
    // Todo: apply patchInfo refactor;
    if (braid && doc && patchInfo) {
      try {
        let merge_version = doc.mergeBytes(Buffer.from(patchInfo.patch))
        doc.mergeVersions(doc.getLocalVersion(), merge_version)

        // if (doc.getLocalVersion() !== serverVersion) {
        //   throw new Error("merge failed");
        // }
        // todo: use editor to update;

        let xfSince = doc.xfSince(patchInfo.before);
        console.log(xfSince);
        setContent(doc.get());
      } catch (e) {
        console.log(e);
      }
    }

    // const { start, end, text } = msg.value;
    // editor?.executeEdits("fk", new editor.EditOperation(start, end, text));
    // subscribe
  }, [patchInfo]);

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

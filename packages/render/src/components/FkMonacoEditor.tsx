import MonacoEditor from "react-monaco-editor";
import React from "react";
import { webSocket } from "rxjs/webSocket";
import { editor } from "monaco-editor";
import { addDotLangSupport } from "./editor/dot-lang";
import { CodeProp } from "../type";

export function FkMonacoEditor(props: { code: CodeProp, setCode: (code: CodeProp) => void }) {
  const subject: any = webSocket(`ws://localhost:8804/living/edit`);
  subject.subscribe({
    next: (msg: any) => console.log('message received: ' + msg),
    error: (err: any) => console.log(err),
    complete: () => console.log('complete')
  });

  const handleTextChange = (newValue: string, event: editor.IModelContentChangedEvent) => {
    event.changes.sort((change1, change2) => change2.rangeOffset - change1.rangeOffset).forEach(change => {
      console.log("delete", change.rangeOffset, change.rangeLength, change.text);
      console.log("insert", change.rangeOffset, change.text);
      subject.next({
        "type": "Insert",
        "value": { "content": change.text, "pos": change.rangeOffset, "room_id": "room" }
      });
      subject.next({
        "type": "Delete",
        "value": {
          "range": { "start": change.rangeOffset, "end": change.rangeOffset + change.rangeLength - 1 },
          "room_id": "room"
        }
      })
    })

    props.setCode({
      ...props.code,
      content: newValue
    });
  }

  const editorDidMount = (editor: any, monaco: any) => {
    addDotLangSupport(monaco);
    editor.layout();
    editor.focus();

    subject.next({ "type": "CreateRoom", "value": { "agent_name": "agent", "room_id": "room" } });
  }

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

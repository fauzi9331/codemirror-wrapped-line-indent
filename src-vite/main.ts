import { basicSetup, EditorView } from "codemirror";
import { wrappedLineIndent } from "../src/index";

const editor = new EditorView({
  doc: "123",
  extensions: [
    basicSetup,
    wrappedLineIndent, // remove this extension -> no error anymore
  ],
  parent: document.getElementById("app")!,
});

editor.dispatch({
  changes: {
    from: 0,
    to: editor.state.doc.length,
    insert: "12345",
  },
});
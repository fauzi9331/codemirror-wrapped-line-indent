import { basicSetup, EditorView } from "codemirror";
import { EditorSelection, EditorState } from "@codemirror/state";
import { wrappedLineIndent } from "../src/index";
import { keymap } from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
  redo,
  redoDepth,
  undo,
  undoDepth
} from '@codemirror/commands'
import { indentationMarkers } from '@replit/codemirror-indentation-markers'
import { indentUnit } from "@codemirror/language";



const doc = `{
\t"nested": {
\t\t"value": 42asdfweeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
\t} 
}
`;


const tabSize = 8;

function changeBySelectedLine(state, f) {
    let atLine = -1;
    return state.changeByRange(range => {
        let changes = [];
        for (let pos = range.from; pos <= range.to;) {
            let line = state.doc.lineAt(pos);
            if (line.number > atLine && (range.empty || range.to > line.from)) {
                f(line, changes, range);
                atLine = line.number;
            }
            pos = line.to + 1;
        }
        let changeSet = state.changes(changes);
        return { changes,
            range: EditorSelection.range(changeSet.mapPos(range.anchor, 1), changeSet.mapPos(range.head, 1)) };
    });
}

const indentMore = ({ state, dispatch }) => {
  if (state.readOnly)
      return false;
  dispatch(state.update(changeBySelectedLine(state, (line, changes) => {
      changes.push({ from: line.from, insert: '\t' });
  }), { userEvent: "input.indent" }));
  return true;
};

window.editor = new EditorView({
  doc,
  extensions: [
    basicSetup,
    EditorState.tabSize.of(tabSize),
    indentUnit.of('\t'),
    EditorView.lineWrapping,
    keymap.of([{ key: "Tab", run: indentMore }]),
    indentationMarkers({ hideFirstIndent: true }),
    wrappedLineIndent
  ],
  parent: document.getElementById("app"),
});

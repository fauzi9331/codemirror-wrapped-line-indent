import { getIndentUnit } from "@codemirror/language";
import { EditorState, Line, RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  type DecorationSet,
  type PluginValue,
} from "@codemirror/view";

class WrappedLineIndent implements PluginValue {
  view: EditorView;
  decorations!: DecorationSet;
  initialPaddingLeft: string | null;
  indentUnit: number;

  constructor(view: EditorView) {
    this.view = view;
    this.indentUnit = getIndentUnit(view.state);
    this.initialPaddingLeft = null;
    this.generate(view.state);
  }

  update(update: ViewUpdate) {
    const indentUnit = getIndentUnit(update.state);
    if (
      indentUnit !== this.indentUnit ||
      update.docChanged ||
      update.viewportChanged
    ) {
      this.indentUnit = indentUnit;
      this.generate(update.state);
    }
  }

  private generate(state: EditorState) {
    const builder = new RangeSetBuilder<Decoration>();
    if (this.initialPaddingLeft) {
      this.addStyleToBuilder(builder, state, this.initialPaddingLeft)
    } else {
      this.view.requestMeasure({
        read: (view) => {
          const lineElement = view.contentDOM.querySelector(".cm-line");
          if (lineElement) {
            this.initialPaddingLeft = window
              .getComputedStyle(lineElement)
              .getPropertyValue("padding-left");
            this.addStyleToBuilder(builder, view.state, this.initialPaddingLeft);
          }

          this.decorations = builder.finish();
        },
      });
    }
    this.decorations = builder.finish()
  }

  private addStyleToBuilder(
    builder: RangeSetBuilder<Decoration>,
    state: EditorState,
    initialPaddingLeft: string
  ) {
    const visibleLines = this.getVisibleLines(state);
    for (const line of visibleLines) {
      const indentSize = this.getIndentSize(line);
      const paddingValue = `calc(${
        indentSize + this.indentUnit
      }ch + ${initialPaddingLeft})`;
      builder.add(
        line.from,
        line.from,
        Decoration.line({
          attributes: {
            style: `padding-left: ${paddingValue}; text-indent: -${
              indentSize + this.indentUnit
            }ch;`,
          },
        })
      );
    }
  }

  // Get all lines that are currently visible in the viewport.
  private getVisibleLines(state: EditorState) {
    const lines = new Set<Line>();
    let lastLine: Line | null = null;

    for (const { from, to } of this.view.visibleRanges) {
      let pos = from;
      while (pos <= to) {
        const line = state.doc.lineAt(pos);
        if (lastLine !== line) {
          lines.add(line);
          lastLine = line;
        }
        pos = line.to + 1;
      }
    }
    return lines;
  }

  private getIndentSize(line: Line) {
    return line.text.length - line.text.trimStart().length;
  }
}

export const wrappedLineIndent = [
  ViewPlugin.fromClass(WrappedLineIndent, {
    decorations: (v) => v.decorations,
  }),
];

# Wrapped Line Indentation for CodeMirror

An extension for [CodeMirror](https://codemirror.net/) that adds indentation for wrapped lines.

## Installation

Using npm:

```bash
npm install codemirror-wrapped-line-indent
```

## Usage

```javascript
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { wrappedLineIndent } from 'codemirror-wrapped-line-indent';

// ... your CodeMirror setup code ...

const state = EditorState.create({
  // ... other state options ...
  extensions: [
    EditorView.lineWrapping,
    wrappedLineIndent
  ]
});

const view = new EditorView({ state });
```


## License

[MIT](./LICENSE)
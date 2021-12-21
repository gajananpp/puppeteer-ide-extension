import React, {useEffect, useRef, useState} from 'react';
import * as monaco from 'monaco-editor';

interface EditorProps {
  /** on editor value change handler */
  onChange: (value: string) => void;
  /** extra lib type definitions file contents */
  extraTypeDefs?: string[];
  /** editor theme */
  theme?: 'light' | 'dark';
  /** default value to show in editor */
  defaultValue: string;
}

(self as any).MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: any, label: string) {
    return label === 'javascript' || label === 'typescript'
      ? 'ts.worker.js'
      : 'editor.worker.js';
  },
};

/**
 * VS Code's monaco editor as a react component.
 * Editor's theme will be inherited from browser's devtools theme.
 * Click [here](https://github.com/microsoft/monaco-editor) for more info about monaco-editor
 *
 * @param props - {@link EditorProps}
 * @returns Editor Component
 */
export const Editor = (props: EditorProps) => {
  const editorContainer = useRef<HTMLDivElement>(null);

  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorContainer.current) {
      props.extraTypeDefs?.forEach(typeDef => {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(typeDef);
        monaco.editor.createModel(typeDef, 'javascript');
      });

      const editor = monaco.editor.create(editorContainer.current, {
        value: props.defaultValue?.trim().length ? props.defaultValue : '',
        language: 'javascript',
        theme: props.theme === 'light' ? 'vs' : 'vs-dark',
      });
      setEditor(editor);
      editor.onDidChangeModelContent(() => props.onChange(editor.getValue()));

      const windowResizeHandler = () => {
        editor.layout();
      };
      window.addEventListener('resize', windowResizeHandler);

      return () => {
        window.removeEventListener('resize', windowResizeHandler);
        editor.dispose();
      };
    } else {
      return () => {};
    }
  }, []);

  useEffect(() => {
    // update only once
    if (editor && !editor.getValue().trim().length) {
      editor.setValue(props.defaultValue);
    }
  }, [props.defaultValue]);

  return <div id="editor" ref={editorContainer}></div>;
};

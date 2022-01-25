import React, {useContext, useEffect, useRef, useState} from 'react';
import * as monaco from 'monaco-editor';
import {IDEContext} from './IDEContext';

interface EditorProps {
  /** On editor value change handler */
  onChange: (value: string) => void;
  /** Monaco editor model */
  model: monaco.editor.ITextModel;
  /** Custom actions */
  actions: monaco.editor.IActionDescriptor[];
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
 * Click [here](https://github.com/microsoft/monaco-editor) for more info about monaco-editor
 *
 * @param props - {@link EditorProps}
 * @returns Editor Component
 */
export const Editor = (props: EditorProps) => {
  const editorContainer = useRef<HTMLDivElement>(null);
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  const {theme} = useContext(IDEContext);

  useEffect(() => {
    if (editorContainer.current) {
      const editor = monaco.editor.create(editorContainer.current, {
        model: props.model,
        theme: theme === 'light' ? 'vs' : 'vs-dark',
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
    props.actions.forEach(action => editor?.addAction(action));
  }, [editor]);

  useEffect(() => {
    editor?.setModel(props.model);
  }, [editor, props.model]);

  useEffect(() => {
    monaco.editor.setTheme(theme === 'light' ? 'vs' : 'vs-dark');
  }, [theme]);

  return <div id="editor" ref={editorContainer}></div>;
};

import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ editorContent, setEditorContent }) => {
  return (
    <ReactQuill
      value={editorContent}
      onChange={setEditorContent}
      placeholder="Start typing..."
    />
  );
};

export default TextEditor;

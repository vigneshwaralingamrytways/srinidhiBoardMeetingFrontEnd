import { useEffect, useRef } from "react";
import {
  FaBold, FaItalic, FaUnderline, FaListUl, FaListOl,
  FaAlignLeft, FaAlignCenter, FaAlignRight,
} from "react-icons/fa";

export default function RichTextEditor({ value, onChange, placeholder = "Type here...", minHeight = 140 }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleCommand = (command) => {
    editorRef.current?.focus();
    document.execCommand("styleWithCSS", false, true);
    document.execCommand(command, false, null);
    handleInput();
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    if (html === "<br>" || html === "<div><br></div>" || html === "&nbsp;") {
      onChange(""); return;
    }
    onChange(html);
  };

  const preventBlur = (e) => { e.preventDefault(); };

  return (
    <div className="co-rich-editor-wrap">
      <div className="co-rich-toolbar">
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("bold")}><FaBold /></button>
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("italic")}><FaItalic /></button>
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("underline")}><FaUnderline /></button>
        <div className="co-rich-divider" />
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("justifyLeft")}><FaAlignLeft /></button>
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("justifyCenter")}><FaAlignCenter /></button>
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("justifyRight")}><FaAlignRight /></button>
        <div className="co-rich-divider" />
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("insertUnorderedList")}><FaListUl /></button>
        <button type="button" className="co-rich-tool-btn" onMouseDown={preventBlur} onClick={() => handleCommand("insertOrderedList")}><FaListOl /></button>
      </div>
      <div
        ref={editorRef}
        className="co-rich-editor"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={handleInput}
        spellCheck={false}
        dir="ltr"
        style={{ minHeight }}
      />
    </div>
  );
}

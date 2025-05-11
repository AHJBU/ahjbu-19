
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  dir?: "ltr" | "rtl";
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  height = 300,
  dir = "ltr"
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [editorValue, setEditorValue] = useState(value || "");

  // Since ReactQuill is a client-side only component, we need to make sure
  // it's only rendered after the component is mounted
  useEffect(() => {
    setIsMounted(true);
    setEditorValue(value || "");
  }, [value]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      [{ direction: dir === "rtl" ? "rtl" : "ltr" }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "direction",
  ];

  return (
    <div 
      className={cn(
        "rich-text-editor border rounded-md overflow-hidden",
        dir === "rtl" ? "text-right" : "text-left"
      )}
      dir={dir}
    >
      {/* Added custom styles for RTL support */}
      <style>
        {`
          .ql-editor {
            min-height: ${height}px;
            direction: ${dir};
            text-align: ${dir === "rtl" ? "right" : "left"};
          }
          
          .ql-snow .ql-picker.ql-header {
            direction: ltr;
          }
        `}
      </style>
      
      {isMounted ? (
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ height }}
        />
      ) : (
        <div 
          className="bg-muted/20 p-4 min-h-[200px]"
          style={{ height }}
        >
          <p className="text-muted-foreground">{placeholder}</p>
        </div>
      )}
    </div>
  );
}

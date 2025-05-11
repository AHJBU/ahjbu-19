
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLanguage } from '@/context/LanguageContext';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  dir?: 'ltr' | 'rtl';
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
  height = 300,
  dir = 'ltr'
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();

  // Modules for toolbar
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  // Formats allowed in the editor
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image',
    'color', 'background'
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="border rounded-md p-2" 
        style={{ height, minHeight: height }}
      >
        <div className="animate-pulse h-full bg-muted"></div>
      </div>
    );
  }

  return (
    <div dir={dir} className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || (language === 'en' ? 'Write something...' : 'اكتب شيئًا...')}
        style={{ height, direction: dir }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: ${height - 42}px;
          font-size: 16px;
        }
        .rich-text-editor .ql-editor {
          min-height: ${height - 42}px;
          direction: ${dir};
        }
        .rich-text-editor .ql-toolbar {
          direction: ltr;
        }
      `}</style>
    </div>
  );
}

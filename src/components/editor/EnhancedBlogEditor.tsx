import React, { useState, useCallback } from 'react';
import { useSlate, Slate, Editable } from 'slate-react';
import { createEditor } from 'slate';
import { Transforms, Editor, Element } from 'slate';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/context/LanguageContext";
import { AITranslation } from "@/components/ai/AITranslation";
import { AITextGeneration } from "@/components/ai/AITextGeneration";
import { initialValue } from './initialValue';

// Define custom element types
type ParagraphElement = {
  type: 'paragraph';
  children: any[];
};

type HeadingElement = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: any[];
};

type CustomElement = ParagraphElement | HeadingElement;

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

export const EnhancedBlogEditor = ({
  title: initialTitle,
  content: initialContent,
  contentType: initialContentType = "content",
  onTitleChange,
  onContentChange,
}: {
  title: string;
  content: any;
  contentType?: "content" | "excerpt";
  onTitleChange: (title: string) => void;
  onContentChange: (content: any) => void;
}) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent || initialValue);
  const [contentType, setContentType] = useState<"content" | "excerpt">(initialContentType);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const editor = useSlate();
  const { toast } = useToast()

  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 500);

  React.useEffect(() => {
    onTitleChange(debouncedTitle);
  }, [debouncedTitle, onTitleChange]);

  React.useEffect(() => {
    onContentChange(debouncedContent);
  }, [debouncedContent, onContentChange]);

  const renderElement = useCallback((props: any) => {
    return <ElementComponent {...props} />
  }, []);

  const renderLeaf = useCallback((props: any) => {
    return <Leaf {...props} />
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTranslation = (translatedText: string) => {
    if (contentType === "content") {
      setContent(translatedText);
    } else {
      setTitle(translatedText);
    }
    toast({
      title: t('translationComplete'),
      description: t('translationApplied'),
    })
  };

  const handleGeneratedContent = (generatedText: string) => {
    setContent(generatedText);
    toast({
      title: t('generationComplete'),
      description: t('contentGenerated'),
    })
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Label htmlFor="title">{t('title')}</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder={t('enterTitle')}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="content-type">{t('contentType')}</Label>
        <Select value={contentType} onValueChange={(value) => setContentType(value as "content" | "excerpt")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="content">{t('content')}</SelectItem>
            <SelectItem value="excerpt">{t('excerpt')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="show-translation">{t('showTranslation')}</Label>
        <Switch
          id="show-translation"
          checked={showTranslation}
          onCheckedChange={(checked) => setShowTranslation(checked)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="show-ai-generator">{t('showAIGenerator')}</Label>
        <Switch
          id="show-ai-generator"
          checked={showAIGenerator}
          onCheckedChange={(checked) => setShowAIGenerator(checked)}
        />
      </div>

      {showTranslation && (
        <div className="mb-4 p-4 border rounded-md bg-background">
          <AITranslation
            text={contentType === "content" ? content : title}
            onTranslated={(translatedText) => {
              handleTranslation(translatedText);
            }}
          />
        </div>
      )}

      {showAIGenerator && (
        <div className="space-y-2">
          <Label htmlFor="ai-prompt">{t('aiPrompt')}</Label>
          <Input
            type="text"
            id="ai-prompt"
            placeholder={t('enterPrompt')}
            value={aiPrompt}
            onChange={(e) => setAIPrompt(e.target.value)}
          />
        </div>
      )}

      {showAIGenerator && (
        <div className="mb-4 p-4 border rounded-md bg-background">
          <AITextGeneration
            title={t('generateContent')}
            prompt={aiPrompt}
            onGenerate={(generatedText) => handleGeneratedContent(generatedText)}
          />
        </div>
      )}

      <Separator />

      <Slate
        editor={editor}
        value={content}
        onChange={value => {
          setContent(value)
        }}
      >
        <div>
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
          <MarkButton format="code" icon="code" />
          <BlockButton format="heading-one" icon="looks_one" />
          <BlockButton format="heading-two" icon="looks_two" />
          <BlockButton format="block-quote" icon="format_quote" />
          <BlockButton format="numbered-list" icon="format_list_numbered" />
          <BlockButton format="bulleted-list" icon="format_list_bulleted" />
          <BlockButton format="left" icon="format_align_left" />
          <BlockButton format="center" icon="format_align_center" />
          <BlockButton format="right" icon="format_align_right" />
          <BlockButton format="justify" icon="format_align_justify" />
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
        />
      </Slate>
    </div>
  );
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )

  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })

  Transforms.setNodes(editor, {
    align: isActive ? undefined : format,
  }, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      TEXT_ALIGN_TYPES.includes(n.align as string),
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      TEXT_ALIGN_TYPES.includes(format) ?
      TEXT_ALIGN_TYPES.includes(n.align as string) || LIST_TYPES.includes(n.type) :
      TEXT_ALIGN_TYPES.includes(n.align as string) === false
    ,
    split: true,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block, {
      match: n => !Editor.isEditor(n) && Element.isElement(n) && (n.type === 'list-item'),
    })
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
};

const isBlockActive = (editor: Editor, format: string, blockType: 'type' | 'align' = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [block] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      n[blockType] === format,
  })

  return !!block
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? !!marks[format] : false
};

const ElementComponent = ( props: any ) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'left':
      return <div style={{ textAlign: 'left' }} {...attributes}>{children}</div>
    case 'center':
      return <div style={{ textAlign: 'center' }} {...attributes}>{children}</div>
    case 'right':
      return <div style={{ textAlign: 'right' }} {...attributes}>{children}</div>
    case 'justify':
      return <div style={{ textAlign: 'justify' }} {...attributes}>{children}</div>
    default:
      return <p {...attributes}>{children}</p>
  }
};

const Leaf = ( props: any ) => {
  const { attributes, children, leaf } = props
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
};

const BlockButton = ( props: any ) => {
  const { format, icon } = props;
  const editor = useSlate()
  return (
    <Button
      variant="ghost"
      size="sm"
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {icon}
    </Button>
  )
};

const MarkButton = ( props: any ) => {
  const { format, icon } = props;
  const editor = useSlate()
  return (
    <Button
      variant="ghost"
      size="sm"
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {icon}
    </Button>
  )
};

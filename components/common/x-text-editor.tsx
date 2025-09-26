"use client";

import { XButton, XInput, XLabel, XPopover } from "@/components/common";
import { cn } from "@/lib/utils";
import BulletList from "@tiptap/extension-bullet-list";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";
import { forwardRef, useEffect, useState } from "react";

interface XTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}

const XTextEditor = forwardRef<HTMLDivElement, XTextEditorProps>(
  (
    {
      value = "",
      onChange,
      placeholder = "Nhập nội dung...",
      className,
      label,
      required = false,
      error = false,
      disabled = false,
      onImageUpload,
      ...props
    },
    ref
  ) => {
    const [isClient, setIsClient] = useState(false);
    const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    useEffect(() => {
      setIsClient(true);
    }, []);

    const handleImageUpload = async (file: File) => {
      if (!onImageUpload) {
        const url = URL.createObjectURL(file);
        return url;
      }

      try {
        const imageUrl = await onImageUpload(file);
        return imageUrl;
      } catch (error) {
        console.error("Lỗi upload hình ảnh:", error);
        return URL.createObjectURL(file);
      }
    };

    const addImage = async () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const imageUrl = await handleImageUpload(file);
          editor?.chain().focus().setImage({ src: imageUrl }).run();
        }
      };
      input.click();
    };

    const handleSetLink = () => {
      if (linkUrl.trim()) {
        editor?.chain().focus().setLink({ href: linkUrl.trim() }).run();
      }
      setLinkPopoverOpen(false);
      setLinkUrl("");
    };

    const removeLink = () => {
      editor?.chain().focus().unsetLink().run();
    };

    const editor = useEditor(
      {
        extensions: [
          StarterKit,
          Color,
          TextStyle,
          BulletList,
          OrderedList,
          ListItem,
          TextAlign.configure({
            types: ["heading", "paragraph"],
          }),
          Image.configure({
            HTMLAttributes: {
              class: "max-w-full h-auto rounded-lg",
            },
          }),
          Link.configure({
            openOnClick: false,
            HTMLAttributes: {
              class: "text-blue-500 underline cursor-pointer",
            },
          }),
        ],
        content: value,
        editable: !disabled,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
          const html = editor.getHTML();
          onChange?.(html);
        },
        editorProps: {
          attributes: {
            class:
              "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-3",
            placeholder: placeholder,
          },
        },
      },
      [isClient]
    );

    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value);
      }
    }, [value, editor]);

    if (!isClient) {
      return (
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {label && (
            <XLabel required={required} error={error}>
              {label}
            </XLabel>
          )}
          <div
            className={cn(
              "border rounded-md h-[200px] flex items-center justify-center",
              error ? "border-red-500" : "border-input",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="text-muted-foreground">Đang tải editor...</span>
          </div>
        </div>
      );
    }

    if (!editor) {
      return null;
    }

    const ToolbarButton = ({
      onClick,
      isActive = false,
      children,
      title,
    }: {
      onClick: () => void;
      isActive?: boolean;
      children: React.ReactNode;
      title: string;
    }) => (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
          "p-2 rounded hover:bg-accent",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        {children}
      </button>
    );

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <XLabel required={required} error={error}>
            {label}
          </XLabel>
        )}
        <div
          className={cn(
            "border rounded-md",
            error ? "border-red-500" : "border-input",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="border-b p-2 flex flex-wrap gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              title="Hoàn tác"
            >
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              title="Làm lại"
            >
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-8 bg-border mx-1" />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              isActive={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Type className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-8 bg-border mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-8 bg-border mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              isActive={editor.isActive({ textAlign: "justify" })}
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-8 bg-border mx-1" />

            <ToolbarButton onClick={addImage} title="Thêm hình ảnh">
              <ImageIcon className="h-4 w-4" />
            </ToolbarButton>

            <XPopover
              open={linkPopoverOpen}
              onOpenChange={(open) => {
                setLinkPopoverOpen(open);
                if (open) {
                  setLinkUrl("");
                }
              }}
              align="center"
              contentClassName="p-0 shadow-none rounded-full"
              trigger={
                <XButton
                  type="button"
                  title="Thêm link"
                  className={cn(
                    "p-2 rounded hover:bg-accent w-8",
                    editor.isActive("link") &&
                      "bg-accent text-accent-foreground"
                  )}
                  variant="ghost"
                  size="sm"
                >
                  <LinkIcon className="h-4 w-4" />
                </XButton>
              }
            >
              <div className="flex items-center gap-2 w-full">
                <XInput
                  placeholder="Nhập URL..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSetLink();
                    }
                  }}
                  wrapperClassName="w-full"
                  className="w-full border-none shadow-none h-11"
                />
                <div className="w-px h-6 bg-border" />
                <XButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setLinkUrl("")}
                  title="Xóa URL"
                  className="!bg-transparent mr-2"
                >
                  <Trash2 className="h-4 w-4" />
                </XButton>
              </div>
            </XPopover>

            {editor.isActive("link") && (
              <ToolbarButton onClick={removeLink} title="Xóa link">
                <LinkIcon className="h-4 w-4 text-red-500" />
              </ToolbarButton>
            )}

            <div className="w-px h-8 bg-border mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().setColor("#ef4444").run()}
              isActive={editor.isActive("textStyle", { color: "#ef4444" })}
              title="Red"
            >
              <div className="h-4 w-4 rounded bg-red-500" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setColor("#3b82f6").run()}
              isActive={editor.isActive("textStyle", { color: "#3b82f6" })}
              title="Blue"
            >
              <div className="h-4 w-4 rounded bg-blue-500" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setColor("#10b981").run()}
              isActive={editor.isActive("textStyle", { color: "#10b981" })}
              title="Green"
            >
              <div className="h-4 w-4 rounded bg-green-500" />
            </ToolbarButton>
          </div>

          <EditorContent
            editor={editor}
            className="min-h-[150px] max-h-[300px] overflow-y-auto"
          />
        </div>
      </div>
    );
  }
);

XTextEditor.displayName = "XTextEditor";

export { XTextEditor };

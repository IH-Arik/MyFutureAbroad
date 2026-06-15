"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-36 rounded-md border border-input bg-muted/40 animate-pulse" />,
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, minHeight = 180, placeholder }: MarkdownEditorProps) {
  const [raw, setRaw] = useState(false);

  return (
    <div>
      <div className="flex justify-end mb-1">
        <Button
          type="button"
          variant={raw ? "secondary" : "ghost"}
          size="sm"
          className="h-6 px-2 text-xs text-muted-foreground"
          onClick={() => setRaw((v) => !v)}
        >
          {raw ? "← Rich editor" : "Raw"}
        </Button>
      </div>

      {raw ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ minHeight }}
          placeholder={placeholder}
          className="font-mono text-xs leading-relaxed"
        />
      ) : (
        <div data-color-mode="light" className="rounded-md overflow-hidden border border-border [&_.w-md-editor]:!border-0 [&_.w-md-editor]:!rounded-md [&_.w-md-editor-toolbar]:!border-b [&_.w-md-editor-toolbar]:!border-border [&_.w-md-editor-toolbar]:!bg-muted/60">
          <MDEditor
            value={value}
            onChange={(v) => onChange(v ?? "")}
            preview="live"
            style={{ minHeight }}
          />
        </div>
      )}
    </div>
  );
}

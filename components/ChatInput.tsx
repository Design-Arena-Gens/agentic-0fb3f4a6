'use client';

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSubmit: (message: string) => Promise<void> | void;
  disabled?: boolean;
}

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    const element = textareaRef.current;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
    const computedRows = Math.min(Math.max(Math.floor(element.scrollHeight / 24), 1), 6);
    setRows(computedRows);
  }, [value]);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setValue("");
    await onSubmit(trimmed);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleSubmit();
    }
  };

  return (
    <div className="relative w-full rounded-3xl bg-surface/70 p-3 shadow-lg backdrop-blur">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={rows}
        placeholder="Ask me anything…"
        className="w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm leading-relaxed text-white placeholder:text-white/40 focus:outline-none"
      />
      <div className="mt-2 flex justify-between px-2 text-xs text-white/40">
        <span>Shift + Enter for newline</span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="rounded-full bg-accent px-4 py-2 font-medium text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {disabled ? "Thinking…" : "Send"}
        </button>
      </div>
    </div>
  );
}

'use client';

import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/types";
import { MessageBubble } from "./MessageBubble";

interface ChatTimelineProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatTimeline({ messages, isLoading }: ChatTimelineProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea.Root className="relative h-full w-full overflow-hidden rounded-3xl bg-surface/60 shadow-inner">
      <ScrollArea.Viewport ref={viewportRef} className="h-full w-full p-6">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading ? (
            <div className="flex justify-start">
              <div className="animate-pulse rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
                Nova is thinking…
              </div>
            </div>
          ) : null}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none rounded-full bg-white/10 p-0.5 transition-colors hover:bg-white/20"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-white/40" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-transparent" />
    </ScrollArea.Root>
  );
}

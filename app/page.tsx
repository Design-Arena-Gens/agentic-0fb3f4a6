'use client';

import { useCallback, useMemo, useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatInput } from "@/components/ChatInput";
import { ChatTimeline } from "@/components/ChatTimeline";
import type { ChatMessage } from "@/lib/types";

const INITIAL_PROMPT = `You're Nova, an energetic and strategic AI partner. Blend systems thinking with fast, hands-on suggestions.`;

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createId(),
      role: "system",
      content: INITIAL_PROMPT,
      createdAt: new Date().toISOString()
    },
    {
      id: createId(),
      role: "assistant",
      content:
        "Hey there! I’m Nova. Drop in anything you’re wrestling with—ideas, roadmaps, prompts, brainstorms—and I’ll help you move it forward.",
      createdAt: new Date().toISOString()
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const clientFacingMessages = useMemo(
    () => messages.filter((message) => message.role !== "system"),
    [messages]
  );

  const handleSubmit = useCallback(
    async (content: string) => {
      setError(null);
      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content,
        createdAt: new Date().toISOString()
      };

      const optimisticMessages = [...messages, userMessage];
      setMessages(optimisticMessages);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: optimisticMessages.map((message) => ({
              role: message.role,
              content: message.content
            }))
          })
        });

        if (!response.ok) {
          throw new Error("Unable to reach the assistant. Try again in a moment.");
        }

        const data = (await response.json()) as { message: string; provider?: string };

        const assistantMessage: ChatMessage = {
          id: createId(),
          role: "assistant",
          content: data.message,
          createdAt: new Date().toISOString()
        };

        setMessages((current) => [...current, assistantMessage]);
        setProvider(data.provider);
      } catch (caughtError) {
        console.error(caughtError);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something unexpected happened."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="flex w-full max-w-5xl flex-col gap-6">
        <ChatHeader provider={provider} />
        {error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
        <div className="grid h-[65vh] gap-4 rounded-3xl border border-white/5 bg-white/5 p-4 backdrop-blur">
          <ChatTimeline messages={clientFacingMessages} isLoading={isLoading} />
        </div>
        <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
        <footer className="text-center text-xs text-white/40">
          Built for rapid ideation. Drop in /focus commands like `/focus launch plan` to orient Nova around a theme.
        </footer>
      </div>
    </main>
  );
}
